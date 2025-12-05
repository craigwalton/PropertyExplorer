export interface Property {
    coordinates: PropertyCoordinates;
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    publishedOn: Date;
    imgUrl: string;
    linkUrl: string;
    provider: string;
}

export interface PropertyCoordinates {
    latitude: number;
    longitude: number;
}
