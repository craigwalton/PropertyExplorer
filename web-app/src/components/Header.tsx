import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";
import {VisibilityControls} from "./VisibilityControls.tsx";

export function Header({
                           properties,
                           onFilterChange,
                           classifications,
                           showCatchmentAreasState,
                           centreMapOnSelectedPropertyState
                       }: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
    showCatchmentAreasState: [boolean | undefined, (value: boolean | undefined) => void],
    centreMapOnSelectedPropertyState: [boolean | undefined, (value: boolean | undefined) => void],
}) {
    return (
        <div className="header">
            <div className="header-left">
                <Filters
                    properties={properties}
                    onFilterChange={onFilterChange}
                    classifications={classifications}
                />
                <VisibilityControls showCatchmentAreasState={showCatchmentAreasState}/>
            </div>
            <Settings
                centreMapOnSelectedPropertyState={centreMapOnSelectedPropertyState}
            />
        </div>
    );
}
