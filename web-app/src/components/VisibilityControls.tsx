import './VisibilityControls.css';
import {Eye, GraduationCap} from 'lucide-react';


export function VisibilityControls({showPrimaryCatchmentsState, showSecondaryCatchmentsState}: {
    showPrimaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
    showSecondaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
}) {
    const [showPrimaryCatchments, setShowPrimaryCatchments] = showPrimaryCatchmentsState;
    const [showSecondaryCatchments, setShowSecondaryCatchmentAreas] = showSecondaryCatchmentsState;

    return (
        <div className={"visibility-controls-container"}>
            <Eye color="gray"/>
            <button
                onClick={() => setShowPrimaryCatchments(!showPrimaryCatchments)}
                className={`catchment-toggle ${showPrimaryCatchments ? 'active' : ''}`}
                title={showPrimaryCatchments ? 'Hide primary school catchments' : 'Show primary school catchments'}
            >
                <GraduationCap />
                <span>Primary</span>
            </button>
            <button
                onClick={() => setShowSecondaryCatchmentAreas(!showSecondaryCatchments)}
                className={`catchment-toggle ${showSecondaryCatchments ? 'active' : ''}`}
                title={showSecondaryCatchments ? 'Hide secondary school catchments' : 'Show secondary school catchments'}
            >
                <GraduationCap />
                <span>Secondary</span>
            </button>
        </div>

    );
}
