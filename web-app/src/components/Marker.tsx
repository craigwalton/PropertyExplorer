import './Marker.css';
import type {Property} from "../types/property.ts";
import {BillboardGraphics, Entity} from "resium";
import {Cartesian3, Cartographic, Color} from "cesium";
import {type JSX, memo, useMemo} from "react";
import homeSvg from '/assets/icons/home-marker.svg?raw';

const defaultMarker = createMarkerSvg("white", "#374151");
const hoveredMarker = createMarkerSvg("#6bb5c2", "white");
const selectedMarker = createMarkerSvg("#06B6D4", "white");
const defaultLineColor = Color.fromCssColorString("white");
const hoveredLineColor = Color.fromCssColorString("#6bb5c2");
const selectedLineColor = Color.fromCssColorString("#06B6D4");
const billboardPixelOffset = new Cartesian3(0, -10, 0);

function offsetHeight(coordinate: Cartesian3, heightOffset: number): Cartesian3 {
    const cartographic = Cartographic.fromCartesian(coordinate);
    return Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height + heightOffset
    );
}

function createMarkerSvg(circleColor: string, homeColor: string): string {
    const updatedSvg = homeSvg
        .replace(/<circle([^>]*?)fill="[^"]*"/, `<circle$1fill="${circleColor}"`)
        .replace(/<path([^>]*?)fill="[^"]*"/, `<path$1fill="${homeColor}"`);

    return `data:image/svg+xml,${encodeURIComponent(updatedSvg)}`;
}

function MarkerComponent({property, isSelected, isHovered, setSelectedProperty, flyTo}: {
    property: Property,
    isSelected: boolean,
    isHovered: boolean,
    setSelectedProperty: (property: Property) => void,
    flyTo: (coordinates: Cartesian3) => void,
}): JSX.Element {
    const verticalLine = useMemo<[Cartesian3, Cartesian3]>(
        () => {
            const elevated = offsetHeight(property.cartesianCoordinates, 30);
            return [property.cartesianCoordinates, elevated];
        },
        [property.cartesianCoordinates]
    );
    const verticalLineColor = isSelected ? selectedLineColor : isHovered ? hoveredLineColor : defaultLineColor;
    const markerSvg = isSelected ? selectedMarker : isHovered ? hoveredMarker : defaultMarker;

    return (
        <Entity
            key={property.id}
            id={property.id}
            position={verticalLine[1]}
            name={property.title}
            properties={{
                isPropertyMarker: true,
                propertyId: property.id,
            }}
            polyline={{
                positions: verticalLine,
                material: verticalLineColor,
                width: 2,
            }}
            onClick={() => {
                setSelectedProperty(property);
                flyTo(property.cartesianCoordinates);
            }}
        >
            <BillboardGraphics
                image={markerSvg}
                pixelOffset={billboardPixelOffset}
            />
        </Entity>
    );
}

export const Marker = memo(MarkerComponent);
