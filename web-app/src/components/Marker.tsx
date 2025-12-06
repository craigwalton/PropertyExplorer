import './Marker.css';
import type {Property} from "../types/property.ts";
import {BillboardGraphics, Entity} from "resium";
import {Cartesian3, HeightReference, VerticalOrigin} from "cesium";
import {type JSX, memo, useMemo} from "react";
import homeSvg from '/assets/icons/home-marker.svg?raw';

const defaultMarker = createMarkerSvg("white", "#374151");
const hoveredMarker = createMarkerSvg("#6bb5c2", "white");
const selectedMarker = createMarkerSvg("#06B6D4", "white");


function createMarkerSvg(circleColor: string, homeColor: string): string {
    const updatedSvg = homeSvg
        .replace(/<circle([^>]*?)fill="[^"]*"/, `<circle$1fill="${circleColor}"`)
        .replace(/<path([^>]*?)fill="[^"]*"/, `<path$1fill="${homeColor}"`)
        .replace(/<path([^>]*?)stroke="[^"]*"/, `<path$1stroke="${circleColor}"`);

    return `data:image/svg+xml,${encodeURIComponent(updatedSvg)}`;
}

function MarkerComponent({property, isSelected, isHovered, onClick}: {
    property: Property,
    isSelected: boolean,
    isHovered: boolean,
    onClick: (property: Property) => void,
}): JSX.Element {
    const cartesianCoordinates = useMemo(
        () => Cartesian3.fromDegrees(property.coordinates.longitude, property.coordinates.latitude),
        [property.coordinates]
    );
    const markerSvg = isSelected ? selectedMarker : isHovered ? hoveredMarker : defaultMarker;

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
                verticalOrigin={VerticalOrigin.BOTTOM}
                // Allow nearby markers to overlap buildings/trees.
                disableDepthTestDistance={250}
                // When viewing from directly above (pitch=-90), the markers sometimes hide behind the terrain.
                // This is a balance - too great a -Z offset, and they disappear when the user zooms in close.
                eyeOffset={new Cartesian3(0, 0, -10)}
            />
        </Entity>
    );
}

export const Marker = memo(MarkerComponent);
