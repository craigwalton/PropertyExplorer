import type {Property} from "../types/property";

export interface LoadedPropertyData {
    writtenAt: Date;
    properties: Property[];
}

export async function loadPropertyData(): Promise<LoadedPropertyData> {
    const response = await fetch("data/properties.json");
    const responseData = await response.json() as Record<string, unknown>;

    return {
        writtenAt: new Date(responseData["written_at_datetime"] as string),
        properties: (responseData["properties"] as unknown[]).map((p: unknown) => {
            const r = p as Record<string, unknown>;
            const coordinates = r.coordinates as Record<string, number>;
            const photos = r.photos as Array<{url: string}>;
            return ({
                id: r.id as string,
                coordinates: {
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                },
                title: r.location_line_1 as string,
                location: r.location_line_2 as string,
                price: r.price as number,
                bedrooms: r.bedrooms as number,
                publishedOn: new Date(r.published_datetime as string),
                imgUrl: photos[0]?.url ?? '',
                linkUrl: r.url as string,
                provider: r.provider as string,
            });
        }),
    };
}
