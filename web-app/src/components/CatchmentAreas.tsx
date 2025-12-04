import {GeoJsonDataSource} from "resium";
import {Color, ColorMaterialProperty, ConstantProperty} from "cesium";
import type {GeoJsonDataSource as CesiumGeoJsonDataSource, Entity} from "cesium";
import {CATCHMENT_AREA_IDENTIFIER} from "../types/constants.ts";

export function CatchmentAreas({show, filename}: { show: boolean, filename: string }) {
    const handleOnLoad = (dataSource: CesiumGeoJsonDataSource) => {
        const colorDict: Record<string, Color> = {};
        dataSource.entities.values.forEach((entity: Entity) => {
            if (entity.polygon) {
                // Colours should be unique by name, not polygon as some areas are split into multiple polygons.
                const name = entity.properties!["name"].getValue();
                let color: Color;
                if (colorDict[name]) {
                    color = colorDict[name];
                } else {
                    color = Color.fromHsl(
                        // Golden ratio - 1 to distribute colors evenly.
                        (Object.keys(colorDict).length * 0.618033988749895) % 1.0,
                        0.7,
                        0.5,
                        0.3,
                    );
                    colorDict[name] = color;
                }
                entity.polygon.material = new ColorMaterialProperty(color);
                // Disable the outline as it is not supported on 3D Tiles.
                entity.polygon.outline = new ConstantProperty(false);
                entity.properties!.addProperty(CATCHMENT_AREA_IDENTIFIER, true);
            }
        });
    };

    return (
        <GeoJsonDataSource
            data={filename}
            clampToGround={true}
            onLoad={handleOnLoad}
            show={show}
        />
    );
}
