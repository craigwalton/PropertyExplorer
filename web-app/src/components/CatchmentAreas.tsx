import {GeoJsonDataSource} from "resium";
import {Color, ColorMaterialProperty, ConstantProperty} from "cesium";
import type {GeoJsonDataSource as CesiumGeoJsonDataSource, Entity} from "cesium";
import {CATCHMENT_AREA_IDENTIFIER} from "../types/constants.ts";

export function CatchmentAreas({show}: { show: boolean }) {
    const handleOnLoad = (dataSource: CesiumGeoJsonDataSource) => {
        dataSource.entities.values.forEach((entity: Entity, index: number) => {
            if (entity.polygon) {
                const color = Color.fromHsl(
                    // Golden ratio - 1 to distribute colors evenly.
                    (index * 0.618033988749895) % 1.0,
                    0.7,
                    0.5,
                    0.3,
                );
                entity.polygon.material = new ColorMaterialProperty(color);
                // Disable the outline as it is not supported on 3D Tiles.
                entity.polygon.outline = new ConstantProperty(false);
                entity.properties!.addProperty(CATCHMENT_AREA_IDENTIFIER, true);
            }
        });
    };

    return (
        <GeoJsonDataSource
            data="data/school-catchments.geojson"
            clampToGround={true}
            onLoad={handleOnLoad}
            show={show}
        />
    );
}
