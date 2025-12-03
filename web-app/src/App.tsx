import './App.css'
import type {CesiumComponentRef} from "resium";
import {Cesium3DTileset, Globe, Scene, Viewer} from "resium";
import * as Cesium from "cesium";
import type {JSX} from "react";
import {useCallback, useRef, useState} from "react";

import {ZoomButtons} from "./components/ZoomControls.tsx";
import {Sidebar} from "./components/Sidebar.tsx";
import {Header} from "./components/Header.tsx";
import {CatchmentAreas} from "./components/CatchmentAreas.tsx";
import {CatchmentTooltip} from "./components/CatchmentTooltip.tsx";
import {CesiumEventHandlers} from "./components/CesiumEventHandlers.tsx";
import type {Classification} from "./types/classification";
import type {Property} from "./types/property";
import {FLY_TO_PITCH, FLY_TO_RANGE, INITIAL_CAMERA_DESTINATION, INITIAL_CAMERA_ORIENTATION} from "./types/constants";
import {Marker} from "./components/Marker.tsx";
import {useLocalStorage} from "react-use";
import {
    PROPERTY_CLASSIFICATIONS_KEY,
    PROPERTY_NOTES_KEY,
    SHOW_CATCHMENT_AREAS_KEY,
    CENTRE_MAP_ON_SELECTED_PROPERTY_KEY
} from "./utils/localStorageManager.ts";


export function App(): JSX.Element {
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [cursor, setCursor] = useState<"default" | "pointer">("default");
    const [hoveredCatchmentArea, setHoveredCatchmentArea] = useState<string | null>(null);

    const handleFilterChange = useCallback((newFilteredProperties: Property[]) => {
        setFilteredProperties(newFilteredProperties);
        // Clear selection if it's no longer in the filtered dataset (without taking a dependency on selectedProperty).
        setSelectedProperty(prev =>
            !prev || !newFilteredProperties.find(p => p.id === prev.id)
                ? null
                : prev
        );
    }, []);

    const flyTo = useCallback((position: Cesium.Cartesian3) => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        viewer.camera.flyToBoundingSphere(
            new Cesium.BoundingSphere(position, 0),
            {
                offset:
                    {
                        heading: viewer.camera.heading,
                        pitch: FLY_TO_PITCH,
                        range: FLY_TO_RANGE,
                    },
                duration: 1,
            }
        );
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSelectedProperty(null);
    }, []);

    // TODO: Consider loading property data up front, and computing height adjustments once tileset is loaded.
    async function loadPropertyData(scene: Cesium.Scene) {
        const result = await fetch("data/properties.json");
        const properties = await result.json();
        const coordinates = properties.map((property: any) => {
            return Cesium.Cartesian3.fromDegrees(property.coordinates.lng, property.coordinates.lat);
        });
        // clampToHeightMostDetailed mutates the input coordinates, so pass in a copy.
        const coordsCopy = coordinates.map((c: Cesium.Cartesian3) => c.clone());
        const heightAdjustedCoordinates = await scene.clampToHeightMostDetailed(coordsCopy);
        const results: Property[] = [];
        for (let i = 0; i < coordinates.length; i++) {
            const p = properties[i];
            results.push({
                // heightAdjustedCoordinates will be be undefined for areas without 3D tile coverage.
                cartesianCoordinates: heightAdjustedCoordinates[i] || coordinates[i],
                coordinates: {
                    latitude: p['coordinates'].lat,
                    longitude: p['coordinates'].lng,
                },
                id: p['id'],
                title: p['location_line_1'],
                location: p['location_line_2'],
                price: p['price'],
                bedrooms: p['bedrooms'],
                imgUrl: p['photos'][0]['url'],
                linkUrl: p['url'],
                provider: p['provider'],
            });
        }
        setProperties(results);
    }

    const [classifications, setClassifications] = useLocalStorage<Record<string, Classification>>(
        PROPERTY_CLASSIFICATIONS_KEY,
        {}
    );

    const classifyProperty = useCallback((property: Property, classification: Classification) => {
        setClassifications({
            ...(classifications || {}),
            [property.id]: classification,
        });
    }, [classifications, setClassifications]);

    const [notes, setNotes] = useLocalStorage<Record<string, string>>(
        PROPERTY_NOTES_KEY,
        {}
    );

    const updatePropertyNotes = useCallback((property: Property, noteText: string) => {
        setNotes({
            ...(notes || {}),
            [property.id]: noteText,
        });
    }, [notes,  setNotes]);

    const [showCatchmentAreas, setShowCatchmentAreas] = useLocalStorage<boolean>(
        SHOW_CATCHMENT_AREAS_KEY,
        false
    );

    const [centreMapOnSelectedProperty, setCentreMapOnSelectedProperty] = useLocalStorage<boolean>(
        CENTRE_MAP_ON_SELECTED_PROPERTY_KEY,
        true
    );

    const onPropertyMarkerClick = useCallback((property: Property) => {
        setSelectedProperty(property);
        if (centreMapOnSelectedProperty ?? true) {
            flyTo(property.cartesianCoordinates);
        }
    }, [flyTo, centreMapOnSelectedProperty]);

    const handleViewerReady = useCallback(
        (ref: CesiumComponentRef<Cesium.Viewer> | null) => {
            const viewer = ref?.cesiumElement;
            if (!viewer) return;

            viewerRef.current = viewer;
            viewer.camera.flyTo({
                destination: INITIAL_CAMERA_DESTINATION,
                orientation: INITIAL_CAMERA_ORIENTATION,
                duration: 0,
            });
        }, []);

    return (
        <>
            <Header properties={properties}
                    onFilterChange={handleFilterChange}
                    classifications={classifications ?? {}}
                    showCatchmentAreas={showCatchmentAreas ?? false}
                    setShowCatchmentAreas={setShowCatchmentAreas}
                    centreMapOnSelectedProperty={centreMapOnSelectedProperty ?? true}
                    setCentreMapOnSelectedProperty={setCentreMapOnSelectedProperty}/>
            <div className="main-content">
                <Sidebar selectedProperty={selectedProperty}
                         hoveredProperty={hoveredProperty}
                         onClose={handleSidebarClose}
                         flyTo={flyTo}
                         classification={selectedProperty ? classifications?.[selectedProperty.id] : undefined}
                         classifyProperty={classifyProperty}
                         notes={selectedProperty ? notes?.[selectedProperty.id] || '' : ''}
                         updateNotes={updatePropertyNotes}/>
                <div className="viewer-container">
                    <Viewer ref={handleViewerReady}
                            className={"cesium-viewer"}
                            infoBox={false}
                            fullscreenButton={false}
                            baseLayerPicker={false}
                            homeButton={false}
                            navigationHelpButton={false}
                            sceneModePicker={false}
                            geocoder={false}
                            selectionIndicator={false}
                            timeline={false}
                            animation={false}
                            terrainProvider={new Cesium.EllipsoidTerrainProvider()}
                            style={{cursor: cursor}}
                    >
                        <Globe show={false}/>
                        <Cesium3DTileset
                            url={`https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                            onInitialTilesLoad={async () => {
                                // TODO: Do we need to wait until all initial titleset loaded to be able to compute accurate heights?
                                const scene = viewerRef.current?.scene;
                                if (!scene) throw new Error("Scene ought to be ready before tileset is loaded.");
                                await loadPropertyData(scene);
                            }}
                        />

                        <Scene/>

                        <CatchmentAreas show={showCatchmentAreas ?? false}/>

                        {filteredProperties.map((p) => {
                            return (
                                <Marker key={p.id}
                                        property={p}
                                        isSelected={p.id == selectedProperty?.id}
                                        isHovered={p.id == hoveredProperty?.id}
                                        setSelectedProperty={setSelectedProperty}
                                        onClick={onPropertyMarkerClick}
                                />
                            );
                        })}
                        <ZoomButtons/>
                        <CesiumEventHandlers
                            viewerRef={viewerRef}
                            filteredProperties={filteredProperties}
                            selectedProperty={selectedProperty}
                            setHoveredProperty={setHoveredProperty}
                            setHoveredCatchmentArea={setHoveredCatchmentArea}
                            setCursor={setCursor}
                        />
                    </Viewer>
                    <CatchmentTooltip catchmentName={hoveredCatchmentArea}/>
                </div>
            </div>
        </>
    )
}

export default App
