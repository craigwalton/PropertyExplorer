import {useCesium} from "resium";
import {type JSX, memo, useCallback} from "react";
import {Home, Minus, Plus} from "lucide-react";
import './MapControls.css';
import {INITIAL_CAMERA_DESTINATION, INITIAL_CAMERA_ORIENTATION} from "../types/constants.ts";

function MapButtonsComponent(): JSX.Element {
    const {viewer} = useCesium();

    const zoomIn = useCallback(() => {
        viewer?.camera.zoomIn(200);
    }, [viewer]);

    const zoomOut = useCallback(() => {
        viewer?.camera.zoomOut(200);
    }, [viewer]);

    const mapReset = useCallback(() => {
        viewer?.camera.flyTo({
            destination: INITIAL_CAMERA_DESTINATION,
            orientation: INITIAL_CAMERA_ORIENTATION,
            duration: 0.8,
        });
    }, [viewer]);

    return (
        <div className="map-control">
            <button onClick={zoomIn}
                    className="map-control-button zoom-in-button"
                    aria-label="Zoom In">
                <Plus size={22} color={"white"}/>
            </button>
            <button onClick={mapReset}
                    className="map-control-button map-reset-button"
                    aria-label="Reset Map">
                <Home size={22} color={"white"}/>
            </button>
            <button onClick={zoomOut}
                    className="map-control-button zoom-out-button"
                    aria-label="Zoom Out">
                <Minus size={22} color={"white"}/>
            </button>
        </div>
    );
}

export const MapButtons = memo(MapButtonsComponent);
