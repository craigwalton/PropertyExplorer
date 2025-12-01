import './VisibilityControls.css';
import {Eye} from 'lucide-react';


export function VisibilityControls({setShowCatchmentAreas, showCatchmentAreas}: {
    setShowCatchmentAreas: (value: boolean) => void,
    showCatchmentAreas: boolean,
}) {
    return (
        <div className={"visibility-controls-container"}>
            <Eye color="gray"/>
            <button
                onClick={() => setShowCatchmentAreas(!showCatchmentAreas)}
                className={`catchment-toggle ${showCatchmentAreas ? 'active' : ''}`}
                title={showCatchmentAreas ? 'Hide school catchments' : 'Show school catchments'}
            >
                <span>School catchments</span>
            </button>
        </div>

    );
}
