import * as Cesium from "cesium";
import {Cartesian2} from "cesium";
import {ScreenSpaceEvent, ScreenSpaceEventHandler} from "resium";
import type {RefObject} from "react";
import {useCallback} from "react";
import type {Property} from "../types/property";
import {CATCHMENT_AREA_IDENTIFIER, PROPERTY_MARKER_IDENTIFIER} from "../types/constants";

export function CesiumEventHandlers({
                                        viewerRef,
                                        filteredProperties,
                                        selectedProperty,
                                        setHoveredProperty,
                                        setHoveredCatchmentArea,
                                        setCursor,
                                    }: {
    viewerRef: RefObject<Cesium.Viewer | null>;
    filteredProperties: Property[];
    selectedProperty: Property | null;
    setHoveredProperty: (property: Property | null) => void;
    setHoveredCatchmentArea: (name: string | null) => void;
    setCursor: (cursor: "default" | "pointer") => void;
}) {
    // TODO: Set hovered items to null when mouse exits the Cesium canvas.
    const handleMouseMove = useCallback((movement: { position: Cartesian2 } | {
        startPosition: Cartesian2;
        endPosition: Cartesian2
    }) => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const position = getPosition(movement);
        const picked = viewer.scene.pick(position);
        const pickedEntityPropertyBag = picked?.id?.properties;

        if (pickedEntityPropertyBag?.hasProperty(PROPERTY_MARKER_IDENTIFIER)) {
            const propertyId = pickedEntityPropertyBag["propertyId"].getValue();
            const property = filteredProperties.find(p => p.id === propertyId);
            setHoveredProperty(property ?? null);
            setHoveredCatchmentArea(null);
            setCursor("pointer");
        } else if (pickedEntityPropertyBag?.hasProperty(CATCHMENT_AREA_IDENTIFIER)) {
            // Catchment areas can overlap - show user all that are under the pointer.
            const hoveredAreas: string[] = [];
            viewer.scene.drillPick(position).forEach(p => {
                if (p?.id?.properties?.hasProperty(CATCHMENT_AREA_IDENTIFIER)) {
                    hoveredAreas.push(p.id.properties["name"].getValue());
                }
            });
            setHoveredCatchmentArea(hoveredAreas.join(", "));
            setHoveredProperty(null);
            setCursor("default");
        } else {
            setHoveredProperty(null);
            setHoveredCatchmentArea(null);
            setCursor("default");
        }
    }, [viewerRef, filteredProperties, setHoveredProperty, setHoveredCatchmentArea, setCursor]);

    const handleLeftClick = useCallback((click: { position: Cartesian2 } | {
        startPosition: Cartesian2;
        endPosition: Cartesian2
    }) => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const position = getPosition(click);
        const picked = viewer.scene.pick(position);
        const pickedEntityPropertyBag = picked?.id?.properties;

        if (!pickedEntityPropertyBag?.hasProperty(PROPERTY_MARKER_IDENTIFIER)) {
            const cartesian = viewer.scene.pickPosition(position);
            const {latitude, longitude} = cartesianToLatLon(cartesian, viewer);
            console.log(
                `Left click at lat/lon: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}` +
                `; selected property is ${selectedProperty?.id || 'none'}`);
        }
    }, [viewerRef, selectedProperty]);

    // TODO: If the user tries to pitch in 2D mode, consider advising them to switch to 3D mode.
    // Alternatively, automatically switch to 3D mode.

    return (
        <ScreenSpaceEventHandler>
            <ScreenSpaceEvent
                type={Cesium.ScreenSpaceEventType.MOUSE_MOVE}
                action={handleMouseMove}
            />
            <ScreenSpaceEvent
                type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
                action={handleLeftClick}
            />
        </ScreenSpaceEventHandler>
    );
}

function getPosition(movement: { position: Cartesian2 } | {
    startPosition: Cartesian2;
    endPosition: Cartesian2
}): Cartesian2 {
    return 'endPosition' in movement ? movement.endPosition : movement.position;
}

function cartesianToLatLon(cartesian: Cesium.Cartesian3, viewer: Cesium.Viewer): {
    latitude: number;
    longitude: number
} {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian, viewer.scene.globe.ellipsoid);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    return {latitude, longitude};
}
