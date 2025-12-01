import {type JSX, useEffect, useMemo} from 'react';
import {useLocalStorage} from 'react-use';
import './Filters.css';
import {Filter as FilterIcon} from 'lucide-react';
import type {Property} from "../types/property.ts";
import {CLASSIFICATION_OPTIONS} from "../types/classification.ts";
import {
    FILTER_CLASSIFICATION_SELECTION_KEY,
    FILTER_PRICE_MIN_KEY,
    FILTER_PRICE_MAX_KEY
} from "../utils/localStorageManager.ts";

const CLASSIFICATION_FILTERS = [
    {id: 'all', display: 'All'},
    ...CLASSIFICATION_OPTIONS,
] as const;

const PRICE_OPTIONS = [
    {value: null, display: 'Any'},
    {value: 50000, display: '£50k'},
    {value: 100000, display: '£100k'},
    {value: 200000, display: '£200k'},
    {value: 300000, display: '£300k'},
    {value: 400000, display: '£400k'},
    {value: 500000, display: '£500k'},
    {value: 600000, display: '£600k'},
    {value: 700000, display: '£700k'},
    {value: 800000, display: '£800k'},
    {value: 900000, display: '£900k'},
    {value: 1000000, display: '£1M'},
    {value: 2000000, display: '£2M'},
] as const;

export function Filters({properties, onFilterChange, classifications}: {
    properties: Property[],
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
}) {
    const [classificationFilter, setClassificationFilter] = useLocalStorage<string>(
        FILTER_CLASSIFICATION_SELECTION_KEY, 'all');
    const [minPriceFilter, setMinPriceFilter] = useLocalStorage<number | null>(FILTER_PRICE_MIN_KEY, null);
    const [maxPriceFilter, setMaxPriceFilter] = useLocalStorage<number | null>(FILTER_PRICE_MAX_KEY, null);

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            return passesClassificationFilter(property, classifications, classificationFilter) &&
                passesPriceFilter(property, minPriceFilter ?? null, maxPriceFilter ?? null);
        });
    }, [properties, classificationFilter, classifications, minPriceFilter, maxPriceFilter]);

    useEffect(() => {
        onFilterChange(filteredProperties);
    }, [filteredProperties, onFilterChange]);

    return (
        <div className="filter-container">
            <FilterIcon color="gray"/>
            <div className="classification-filter">
                {CLASSIFICATION_FILTERS.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setClassificationFilter(filter.id)}
                        className={`classification-filter-button ${
                            classificationFilter === filter.id ? 'active' : ''
                        }`}
                        data-filter-type={filter.id}
                    >
                        {filter.display}
                    </button>
                ))}
            </div>
            <div className="price-filter">
                <PriceSelect
                    value={minPriceFilter ?? null}
                    onChange={setMinPriceFilter}
                    placeholder="£ Min"
                    tooltip="Minimum Price"
                />
                <PriceSelect
                    value={maxPriceFilter ?? null}
                    onChange={setMaxPriceFilter}
                    placeholder="£ Max"
                    tooltip="Maximum Price"
                />
            </div>
        </div>
    );
}

function passesClassificationFilter(property: Property,
                                    classifications: Record<string, string>,
                                    filterValue: string | undefined): boolean {
    if (filterValue === 'all' || filterValue == undefined) return true;
    const userClassification = classifications[property.id] || "unclassified";
    return userClassification === filterValue;
}

function passesPriceFilter(property: Property, minPrice: number | null, maxPrice: number | null): boolean {
    if (minPrice !== null && property.price < minPrice) return false;
    if (maxPrice !== null && property.price > maxPrice) return false;
    return true;
}

function PriceSelect({value, onChange, placeholder, tooltip}: {
    value: number | null,
    onChange: (value: number | null) => void,
    placeholder: string,
    tooltip: string,
}): JSX.Element {
    return (
        <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            className="price-filter-select"
            title={tooltip}
        >
            {PRICE_OPTIONS.map((option, index) => (
                <option key={index} value={option.value ?? ''}>
                    {option.value === null ? placeholder : option.display}
                </option>
            ))}
        </select>
    );
}
