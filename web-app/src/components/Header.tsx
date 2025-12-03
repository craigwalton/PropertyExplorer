import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";
import {VisibilityControls} from "./VisibilityControls.tsx";

export function Header({
                           properties,
                           onFilterChange,
                           classifications,
                           showCatchmentAreas,
                           setShowCatchmentAreas,
                           centreMapOnSelectedProperty,
                           setCentreMapOnSelectedProperty
                       }: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
    showCatchmentAreas: boolean,
    setShowCatchmentAreas: (value: boolean) => void,
    centreMapOnSelectedProperty: boolean,
    setCentreMapOnSelectedProperty: (value: boolean) => void,
}) {
    return (
        <div className="header">
            <div className="header-left">
                <Filters
                    properties={properties}
                    onFilterChange={onFilterChange}
                    classifications={classifications}
                />
                <VisibilityControls
                    setShowCatchmentAreas={setShowCatchmentAreas}
                    showCatchmentAreas={showCatchmentAreas}/>
            </div>
            <Settings
                centreMapOnSelectedProperty={centreMapOnSelectedProperty}
                setCentreMapOnSelectedProperty={setCentreMapOnSelectedProperty}
            />
        </div>
    );
}
