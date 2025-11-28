import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";

export function Header({properties, onFilterChange, classifications}: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
}) {
    return (
        <div className="header">
            <Filters
                properties={properties}
                onFilterChange={onFilterChange}
                classifications={classifications}
            />
            <Settings/>
        </div>
    );
}
