import {useCesium} from "resium";
import {type JSX, memo, useCallback} from "react";
import {Home, Minus, Plus} from "lucide-react";
import './MapControls.css';
import {resetCamera, setCameraViewMode} from "../utils/cameraController.ts";


function MapButtonsComponent({viewMode, setViewMode}: {
    viewMode: "2D" | "3D";
    setViewMode: (mode: "2D" | "3D") => void;
}): JSX.Element {
    const {viewer} = useCesium();

    const zoomIn = useCallback(() => {
        viewer?.camera.zoomIn(200);
    }, [viewer]);

    const zoomOut = useCallback(() => {
        viewer?.camera.zoomOut(200);
    }, [viewer]);

    const resetMap = useCallback(() => {
        if (!viewer) return;
        resetCamera(viewer, viewMode, 1);
    }, [viewer, viewMode]);

    const toggleViewMode = useCallback(() => {
        const newViewMode = viewMode === "3D" ? "2D" : "3D";
        setViewMode(newViewMode);
        if (!viewer) return;
        setCameraViewMode(viewer, newViewMode);
    }, [viewMode, setViewMode, viewer]);

    return (
        <div className="map-control">
            <button onClick={zoomIn}
                    className="map-control-button zoom-in-button"
                    aria-label="Zoom In">
                <Plus size={22} color={"white"}/>
            </button>
            <button onClick={resetMap}
                    className="map-control-button map-reset-button"
                    aria-label="Reset Map">
                <Home size={22} color={"white"}/>
            </button>
            <button onClick={zoomOut}
                    className="map-control-button zoom-out-button"
                    aria-label="Zoom Out">
                <Minus size={22} color={"white"}/>
            </button>
            <button onClick={toggleViewMode}
                    className={`map-control-button view-mode-button ${viewMode === "2D" ? "disabled" : ""}`}
                    aria-label={`3D view ${viewMode === "3D" ? "enabled" : "disabled"}`}>
                <span>{viewMode}</span>
            </button>
        </div>
    );
}

export const MapButtons = memo(MapButtonsComponent);
