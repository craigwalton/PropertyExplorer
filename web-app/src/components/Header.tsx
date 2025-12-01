import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";
import {Eye, EyeOff} from "lucide-react";

export function Header({properties, onFilterChange, classifications, showCatchmentAreas, setShowCatchmentAreas}: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
    showCatchmentAreas: boolean,
    setShowCatchmentAreas: (value: boolean) => void,
}) {
    return (
        <div className="header">
            <div className="header-left">
                <Filters
                    properties={properties}
                    onFilterChange={onFilterChange}
                    classifications={classifications}
                />
                <button
                    onClick={() => setShowCatchmentAreas(!showCatchmentAreas)}
                    className={`catchment-toggle ${showCatchmentAreas ? 'active' : ''}`}
                    title={showCatchmentAreas ? 'Hide school catchments' : 'Show school catchments'}
                >
                    {showCatchmentAreas ? <Eye size={18}/> : <EyeOff size={18}/>}
                    <span>School catchments</span>
                </button>
            </div>
            <Settings/>
        </div>
    );
}
