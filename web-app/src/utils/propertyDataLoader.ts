import type {Property} from "../types/property";

export async function loadPropertyData(): Promise<Property[]> {
    const response = await fetch("data/properties.json");
    const responseData = await response.json();
    return responseData.map((p: any) => ({
        id: p.id,
        coordinates: {
            latitude: p.coordinates.lat,
            longitude: p.coordinates.lng,
        },
        title: p.location_line_1,
        location: p.location_line_2,
        price: p.price,
        bedrooms: p.bedrooms,
        publishedOn: new Date(p.published_datetime),
        imgUrl: p.photos[0]?.url ?? '',
        linkUrl: p.url,
        provider: p.provider,
    }));
}
