import type * as Cesium from "cesium";

export interface Property {
    // TODO: Not sure this type should depend on Cesium.
    cartesianCoordinates: Cesium.Cartesian3;
    coordinates: PropertyCoordinates;
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    imgUrl: string;
    linkUrl: string;
    provider: string;
}

export interface PropertyCoordinates {
    latitude: number;
    longitude: number;
}
