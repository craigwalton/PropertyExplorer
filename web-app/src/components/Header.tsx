import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";
import {VisibilityControls} from "./VisibilityControls.tsx";

const STALE_DATA_THRESHOLD_DAYS = 28;

function getDataAgeInDays(retrievedAt: Date | null): number | null {
    if (!retrievedAt) return null;

    const elapsedMilliseconds = Date.now() - retrievedAt.getTime();
    if (elapsedMilliseconds <= STALE_DATA_THRESHOLD_DAYS * 24 * 60 * 60 * 1000) return null;

    return Math.ceil(elapsedMilliseconds / (24 * 60 * 60 * 1000));
}

export function Header({
                           properties,
                           propertyDataRetrievedAt,
                           onFilterChange,
                           classifications,
                           showPrimaryCatchmentsState,
                           showSecondaryCatchmentsState,
                           centreMapOnSelectedPropertyState
}: {
    properties: Property[],
    propertyDataRetrievedAt: Date | null,
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
    showPrimaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
    showSecondaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
    centreMapOnSelectedPropertyState: [boolean | undefined, (value: boolean | undefined) => void],
}) {
    const dataAgeInDays = getDataAgeInDays(propertyDataRetrievedAt);

    return (
        <>
            {dataAgeInDays && (
                <div className="stale-data-banner" role="status">
                    <strong>Source property data is {dataAgeInDays} days old.</strong>
                    <span> New listings, price changes, and availability may not be up to date.</span>
                </div>
            )}
            <div className="header">
                <div className="header-left">
                    <Filters
                        properties={properties}
                        onFilterChange={onFilterChange}
                        classifications={classifications}
                    />
                    <VisibilityControls showPrimaryCatchmentsState={showPrimaryCatchmentsState}
                                        showSecondaryCatchmentsState={showSecondaryCatchmentsState}/>
                </div>
                <Settings
                    centreMapOnSelectedPropertyState={centreMapOnSelectedPropertyState}
                />
            </div>
        </>
    );
}
