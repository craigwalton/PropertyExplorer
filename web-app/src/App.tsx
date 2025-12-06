import './App.css'
import type {CesiumComponentRef} from "resium";
import {Cesium3DTileset, Globe, Scene, Viewer} from "resium";
import * as Cesium from "cesium";
import type {JSX} from "react";
import {useCallback, useEffect, useRef, useState} from "react";

import {MapButtons} from "./components/MapControls.tsx";
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
    CENTRE_MAP_ON_SELECTED_PROPERTY_KEY,
    PROPERTY_CLASSIFICATIONS_KEY,
    PROPERTY_NOTES_KEY,
    SHOW_PRIMARY_CATCHMENT_AREAS_KEY,
    SHOW_SECONDARY_CATCHMENT_AREAS_KEY,
} from "./utils/localStorageManager.ts";
import {loadPropertyData} from "./utils/propertyDataLoader.ts";


export function App(): JSX.Element {
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [cursor, setCursor] = useState<"default" | "pointer">("default");
    const [hoveredCatchmentArea, setHoveredCatchmentArea] = useState<string | null>(null);
    const [showPrimaryCatchments, setShowPrimaryCatchments] = useLocalStorage<boolean>(
        SHOW_PRIMARY_CATCHMENT_AREAS_KEY,
        false
    );
    const [showSecondaryCatchments, setShowSecondaryCatchments] = useLocalStorage<boolean>(
        SHOW_SECONDARY_CATCHMENT_AREAS_KEY,
        false
    );
    const [centreMapOnSelectedProperty, setCentreMapOnSelectedProperty] = useLocalStorage<boolean>(
        CENTRE_MAP_ON_SELECTED_PROPERTY_KEY,
        true
    );
    const [classifications, setClassifications] = useLocalStorage<Record<string, Classification>>(
        PROPERTY_CLASSIFICATIONS_KEY,
        {}
    );

    useEffect(() => {
        loadPropertyData().then(setProperties);
    }, []);

    const handleFilterChange = useCallback((newFilteredProperties: Property[]) => {
        setFilteredProperties(newFilteredProperties);
        // Clear selection if it's no longer in the filtered dataset (without taking a dependency on selectedProperty).
        setSelectedProperty(prev =>
            !prev || !newFilteredProperties.find(p => p.id === prev.id)
                ? null
                : prev
        );
    }, []);

    const flyTo = useCallback((property: Property) => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const target = Cesium.Cartesian3.fromDegrees(
            property.coordinates.longitude,
            property.coordinates.latitude
        );
        viewer.scene.clampToHeightMostDetailed([target])
            .then(([clampedPosition]) => {
                viewer.camera.flyToBoundingSphere(
                    new Cesium.BoundingSphere(clampedPosition ?? target, 0),
                    {
                        offset: new Cesium.HeadingPitchRange(
                            viewer.camera.heading,
                            FLY_TO_PITCH,
                            FLY_TO_RANGE
                        ),
                        duration: 1,
                    }
                );
            });
    }, []);

    // Whilst the sidebar itself does not close, this handles the close button being clicked.
    const handleSidebarClose = useCallback(() => {
        setSelectedProperty(null);
    }, []);

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
    }, [notes, setNotes]);


    const onPropertyMarkerClick = useCallback(async (property: Property) => {
        setSelectedProperty(property);
        if (centreMapOnSelectedProperty ?? true) {
            flyTo(property);
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
                    showPrimaryCatchmentsState={[showPrimaryCatchments, setShowPrimaryCatchments]}
                    showSecondaryCatchmentsState={[showSecondaryCatchments, setShowSecondaryCatchments]}
                    centreMapOnSelectedPropertyState={[centreMapOnSelectedProperty, setCentreMapOnSelectedProperty]}/>
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
                            enableCollision={true}
                            url={`https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                        />

                        <Scene/>

                        <CatchmentAreas filename={"data/primary-school-catchments.geojson"}
                                        show={showPrimaryCatchments ?? false}/>
                        <CatchmentAreas filename={"data/secondary-school-catchments.geojson"}
                                        show={showSecondaryCatchments ?? false}/>

                        {filteredProperties.map((p) => {
                            return (
                                <Marker key={p.id}
                                        property={p}
                                        isSelected={p.id == selectedProperty?.id}
                                        isHovered={p.id == hoveredProperty?.id}
                                        onClick={onPropertyMarkerClick}
                                />
                            );
                        })}
                        <MapButtons/>
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
