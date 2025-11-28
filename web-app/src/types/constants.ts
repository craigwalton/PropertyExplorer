import {Cartesian3} from "cesium";
import * as Cesium from "cesium";

export const FLY_TO_PITCH = Cesium.Math.toRadians(-25);
export const FLY_TO_RANGE = 100; // metres

export const INITIAL_CAMERA_DESTINATION = Cartesian3.fromDegrees(-2.1600, 57.1169, 250)
export const INITIAL_CAMERA_ORIENTATION = {
    heading: Cesium.Math.toRadians(275),
    pitch: Cesium.Math.toRadians(-20),
    roll: 0,
};
