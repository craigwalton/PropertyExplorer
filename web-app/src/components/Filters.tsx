import {useEffect, useMemo} from 'react';
import {useLocalStorage} from 'react-use';
import './Filters.css';
import {Filter as FilterIcon} from 'lucide-react';
import type {Property} from "../types/property.ts";
import {CLASSIFICATION_OPTIONS} from "../types/classification.ts";
import {FILTER_CLASSIFICATION_SELECTION_KEY} from "../utils/localStorageManager.ts";

const FILTERS = [
    {id: 'all', display: 'All'},
    ...CLASSIFICATION_OPTIONS,
] as const;

export function Filters({properties, onFilterChange, classifications}: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
}) {
    const [selectedFilter, setSelectedFilter] = useLocalStorage<string>(FILTER_CLASSIFICATION_SELECTION_KEY, 'all');

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            if (selectedFilter === 'all' || !selectedFilter) return true;
            const userClassification = classifications[property.id] || "unclassified";
            return userClassification === selectedFilter;
        });
    }, [properties, selectedFilter, classifications]);

    useEffect(() => {
        onFilterChange(filteredProperties);
    }, [filteredProperties, onFilterChange]);

    return (
        <div className="filter-container">
            <FilterIcon color="gray"/>
            <div className="filter-buttons">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`filter-button ${
                            selectedFilter === filter.id ? 'active' : ''
                        }`}
                        data-filter-type={filter.id}
                    >
                        {filter.display}
                    </button>
                ))}
            </div>
        </div>
    );
}
