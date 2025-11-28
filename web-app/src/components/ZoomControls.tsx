import {useCesium} from "resium";
import {type JSX, memo, useCallback} from "react";
import {Plus, Minus, Home} from "lucide-react";
import './ZoomControls.css';
import {INITIAL_CAMERA_DESTINATION, INITIAL_CAMERA_ORIENTATION} from "../types/constants.ts";

function ZoomButtonsComponent(): JSX.Element {
    const {viewer} = useCesium();

    const zoomIn = useCallback(() => {
        viewer?.camera.zoomIn(200);
    }, [viewer]);

    const zoomOut = useCallback(() => {
        viewer?.camera.zoomOut(200);
    }, [viewer]);

    const zoomReset = useCallback(() => {
        viewer?.camera.flyTo({
            destination: INITIAL_CAMERA_DESTINATION,
            orientation: INITIAL_CAMERA_ORIENTATION,
            duration: 0.8,
        });
    }, []);

    return (
        <div className="zoom-control">
            <button onClick={zoomIn}
                    className="zoom-control-button zoom-in-button"
                    aria-label="Zoom In">
                <Plus size={22} color={"white"}/>
            </button>
            <button onClick={zoomReset}
                    className="zoom-control-button zoom-reset-button"
                    aria-label="Reset Zoom">
                <Home size={22} color={"white"}/>
            </button>
            <button onClick={zoomOut}
                    className="zoom-control-button zoom-out-button"
                    aria-label="Zoom Out">
                <Minus size={22} color={"white"}/>
            </button>
        </div>
    );
}

export const ZoomButtons = memo(ZoomButtonsComponent);
