import * as Cesium from "cesium";

export const INITIAL_CAMERA_LOOK_AT = Cesium.Cartesian3.fromDegrees(-2.170, 57.118, 25);
export const INITIAL_CAMERA_HEADING = Cesium.Math.toRadians(275);
export const INITIAL_CAMERA_RANGE = 750; // metres

export const DEFAULT_3D_PITCH = Cesium.Math.toRadians(-20);
export const FIXED_2D_PITCH = Cesium.Math.toRadians(-90);
export const NORTH_HEADING = 0;
export const FLY_TO_PROPERTY_RANGE = 100; // metres

export function resetCamera(viewer: Cesium.Viewer, viewMode: "2D" | "3D", duration = 1) {
    viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(INITIAL_CAMERA_LOOK_AT, 0),
        {
            offset: new Cesium.HeadingPitchRange(
                // Camera heading is North for 2D because user cannot rotate map.
                viewMode === "3D" ? INITIAL_CAMERA_HEADING : NORTH_HEADING,
                viewMode === "3D" ? DEFAULT_3D_PITCH : FIXED_2D_PITCH,
                INITIAL_CAMERA_RANGE,
            ),
            duration,
        }
    );
}

export function setCameraViewMode(viewer: Cesium.Viewer, viewMode: "2D" | "3D") {
    const centrePosition = new Cesium.Cartesian2(
        viewer.canvas.clientWidth / 2,
        viewer.canvas.clientHeight / 2
    );
    const targetPosition = viewer.scene.pickPosition(centrePosition) ?? viewer.camera.position;
    const currentRange = Cesium.Cartesian3.distance(targetPosition, viewer.camera.position);
    viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(targetPosition, 0),
        {
            offset: new Cesium.HeadingPitchRange(
                viewMode === "3D" ? viewer.camera.heading : NORTH_HEADING,
                viewMode === "3D" ? DEFAULT_3D_PITCH : FIXED_2D_PITCH,
                currentRange
            ),
            duration: 1,
        }
    );
}

export function flyCameraToPosition(viewer: Cesium.Viewer, lat: number, lon: number, viewMode: "2D" | "3D") {
    const target = Cesium.Cartesian3.fromDegrees(lon, lat);
    viewer.scene.clampToHeightMostDetailed([target])
        .then(([clampedPosition]) => {
            viewer.camera.flyToBoundingSphere(
                new Cesium.BoundingSphere(clampedPosition ?? target, 0),
                {
                    offset: new Cesium.HeadingPitchRange(
                        viewer.camera.heading,
                        viewMode === "3D" ? DEFAULT_3D_PITCH : Cesium.Math.toRadians(-90),
                        FLY_TO_PROPERTY_RANGE
                    ),
                    duration: 1,
                }
            );
        });
}
   
