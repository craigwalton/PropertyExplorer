import './Marker.css';
import type {Property} from "../types/property.ts";
import {BillboardGraphics, Entity} from "resium";
import {Cartesian3, HeightReference, VerticalOrigin} from "cesium";
import {type JSX, memo, useMemo} from "react";
import home3DSvg from '/assets/icons/home-marker.svg?raw';
import home2DSvg from '/assets/icons/home-marker-2d.svg?raw';

const markerDict = {
    "2D": {
        default: createMarkerSvg("white", "#374151", false),
        hovered: createMarkerSvg("#6bb5c2", "white", false),
        selected: createMarkerSvg("#06B6D4", "white", false),
    },
    "3D": {
        default: createMarkerSvg("white", "#374151", true),
        hovered: createMarkerSvg("#6bb5c2", "white", true),
        selected: createMarkerSvg("#06B6D4", "white", true),
    }
}

function createMarkerSvg(circleColor: string, homeColor: string, for3d: boolean): string {
    const baseSvg = for3d ? home3DSvg : home2DSvg;
    const updatedSvg = baseSvg
        .replace(/<circle([^>]*?)fill="[^"]*"/, `<circle$1fill="${circleColor}"`)
        .replace(/<path([^>]*?)fill="[^"]*"/, `<path$1fill="${homeColor}"`)
        .replace(/<path([^>]*?)stroke="[^"]*"/, `<path$1stroke="${circleColor}"`);

    return `data:image/svg+xml,${encodeURIComponent(updatedSvg)}`;
}

function MarkerComponent({property, isSelected, isHovered, onClick, viewMode}: {
    property: Property,
    isSelected: boolean,
    isHovered: boolean,
    onClick: (property: Property) => void,
    viewMode: "2D" | "3D",
}): JSX.Element {
    const cartesianCoordinates = useMemo(
        () => Cartesian3.fromDegrees(property.coordinates.longitude, property.coordinates.latitude),
        [property.coordinates]
    );
    const markers = markerDict[viewMode];
    const markerSvg = isSelected ? markers.selected : isHovered ? markers.hovered : markers.default;

    return (
        <Entity
            key={property.id}
            id={property.id}
            position={cartesianCoordinates}
            name={property.title}
            properties={{
                isPropertyMarker: true,
                propertyId: property.id,
            }}
            onClick={() => onClick(property)}
        >
            <BillboardGraphics
                image={markerSvg}
                heightReference={HeightReference.CLAMP_TO_3D_TILE}
                verticalOrigin={viewMode === "3D" ? VerticalOrigin.BOTTOM : VerticalOrigin.CENTER}
                // In 2D, disable depth-testing. In 3D, allow nearby markers to overlap buildings/trees.
                disableDepthTestDistance={viewMode === "3D" ? 250 : Number.POSITIVE_INFINITY}
                // When viewing from high angles (pitch~=-90), the markers sometimes hide behind the terrain.
                // This is a balance - too great a -Z offset, and they disappear when the user zooms in close.
                eyeOffset={new Cartesian3(0, 0, -10)}
            />
        </Entity>
    );
}

export const Marker = memo(MarkerComponent);
