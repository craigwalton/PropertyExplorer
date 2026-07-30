import './Header.css';
import {Filters} from "./Filters.tsx";
import {Settings} from "./Settings.tsx";
import type {Property} from "../types/property.ts";
import {VisibilityControls} from "./VisibilityControls.tsx";

const STALE_DATA_THRESHOLD_DAYS = 28;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getDataAgeInDays(writtenAt: Date | null): number | null {
    if (!writtenAt) return null;

    const elapsedMilliseconds = Date.now() - writtenAt.getTime();
    return Math.ceil(elapsedMilliseconds / MS_PER_DAY);
}

export function Header({
                           properties,
                           propertyDataWrittenAt,
                           onFilterChange,
                           classifications,
                           showPrimaryCatchmentsState,
                           showSecondaryCatchmentsState,
                           centreMapOnSelectedPropertyState
}: {
    properties: Property[],
    propertyDataWrittenAt: Date | null,
    onFilterChange: (filteredProperties: Property[]) => void,
    classifications: Record<string, string>,
    showPrimaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
    showSecondaryCatchmentsState: [boolean | undefined, (value: boolean | undefined) => void],
    centreMapOnSelectedPropertyState: [boolean | undefined, (value: boolean | undefined) => void],
}) {
    const dataAgeInDays = getDataAgeInDays(propertyDataWrittenAt);
    const displayStaleBanner = dataAgeInDays !== null && dataAgeInDays > STALE_DATA_THRESHOLD_DAYS;

    return (
        <>
            {displayStaleBanner && (
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
