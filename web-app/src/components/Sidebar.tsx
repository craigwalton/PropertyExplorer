import './Sidebar.css';
import {
    Bed,
    Binoculars,
    CircleQuestionMark,
    CircleX,
    ExternalLink,
    Locate,
    Map,
    ThumbsDown,
    ThumbsUp,
    Upload
} from 'lucide-react';
import type {Classification} from '../types/classification';
import type {Property} from '../types/property';
import {type JSX, memo} from "react";

const APPLE_DEVICE = isAppleDevice();

function SidebarComponent({
                              selectedProperty,
                              hoveredProperty,
                              onClose,
                              flyTo,
                              classification,
                              classifyProperty,
                              notes,
                              updateNotes
                          }: {
    selectedProperty: Property | null;
    hoveredProperty: Property | null;
    onClose: () => void;
    flyTo: (property: Property) => void;
    classification: Classification | undefined;
    classifyProperty: (property: Property, classification: Classification) => void;
    notes: string;
    updateNotes: (property: Property, notes: string) => void;
}): JSX.Element {
    if (!selectedProperty && !hoveredProperty) {
        return (
            <div className="sidebar">
                <div className="sidebar-placeholder">
                    Hover over or select a property...
                </div>
            </div>
        );
    }

    if (hoveredProperty && hoveredProperty.id != selectedProperty?.id) {
        return <HoveredSidebarContent property={hoveredProperty}/>;
    }
    return <SelectedSidebarContent
        property={selectedProperty!}
        onClose={onClose}
        flyTo={flyTo}
        classification={classification}
        classifyProperty={classifyProperty}
        notes={notes}
        updateNotes={updateNotes}
    />;
}

export const Sidebar = memo(SidebarComponent);

function SelectedSidebarContentComponent({
                                             property,
                                             onClose,
                                             flyTo,
                                             classification,
                                             classifyProperty,
                                             notes,
                                             updateNotes
                                         }: {
    property: Property;
    onClose: () => void;
    flyTo: (property: Property) => void;
    classification: Classification | undefined;
    classifyProperty: (property: Property, classification: Classification) => void;
    notes: string;
    updateNotes: (property: Property, notes: string) => void;
}): JSX.Element {
    const appleMapsUri = `maps://?ll=${property.coordinates.latitude},${property.coordinates.longitude}&z=40&t=k&q=${property.title}`;
    const streetViewUri = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${property.coordinates.latitude},${property.coordinates.longitude}`;

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className="property-detail-title">
                    {property.title}
                </div>

                <div className="property-detail-location">
                    {property.location}
                </div>

                <div className="property-detail-price">
                    {`£${property.price.toLocaleString()}`}
                </div>

                <PropertyBedrooms count={property.bedrooms}/>

                <PublishedOn date={property.publishedOn}/>

                <img className="property-detail-image"
                     src={property.imgUrl}
                     key={property.imgUrl}
                     alt={property.title}
                />

                <div className="property-classification">
                    <div className="classification-buttons">
                        <button
                            onClick={() => classifyProperty(property, 'shortlist')}
                            className={`classification-button ${
                                classification === 'shortlist' ? 'active' : ''
                            }`}
                            data-classification-type="shortlist"
                            title={"Shortlist Property"}
                        >
                            <ThumbsUp size={14}/>
                            <span>Shortlist</span>
                        </button>
                        <button
                            onClick={() => classifyProperty(property, 'unclassified')}
                            className={`classification-button ${
                                !classification || classification === 'unclassified' ? 'active' : ''
                            }`}
                            data-classification-type="unclassified"
                            title={"Mark Property as Unclassified"}
                        >
                            <CircleQuestionMark size={20}/>
                        </button>
                        <button
                            onClick={() => classifyProperty(property, 'reject')}
                            className={`classification-button ${
                                classification === 'reject' ? 'active' : ''
                            }`}
                            data-classification-type="reject"
                            title={"Reject Property"}
                        >
                            <ThumbsDown size={14}/>
                            <span>Reject</span>
                        </button>
                    </div>
                </div>

                <div className="property-notes">
                    <div className="notes-label">
                        Notes
                    </div>
                    <textarea
                        className="notes-textarea"
                        value={notes}
                        onChange={(e) => updateNotes(property, e.target.value)}
                        placeholder="Add your notes about this property..."
                        rows={4}
                    />
                </div>

                <div className="sidebar-buttons">

                    <button onClick={() => window.open(property.linkUrl, '_blank')}>
                        <ExternalLink size={14}/>
                        View on {property.provider}
                    </button>

                    {APPLE_DEVICE && (
                        <button onClick={() => window.open(appleMapsUri, '_blank')}>
                            <Map size={14}/>
                            Open in Apple Maps
                        </button>
                    )}

                    <button onClick={() => window.open(streetViewUri, '_blank')}>
                        <Binoculars size={14}/>
                        Open in Street View
                    </button>

                    <button onClick={() => flyTo(property)}>
                        <Locate size={14}/>
                        Centre on Map
                    </button>

                    <button onClick={onClose}>
                        <CircleX size={14}/>
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
}

const SelectedSidebarContent = memo(SelectedSidebarContentComponent);

function HoveredSidebarContentComponent({property}: {
    property: Property;
}): JSX.Element {
    return (
        <div className="sidebar sidebar-hovered">
            <div className="sidebar-content">
                <div className="property-detail-title">
                    {property.title}
                </div>

                <div className="property-detail-location">
                    {property.location}
                </div>

                <div className="property-detail-price">
                    {`£${property.price.toLocaleString()}`}
                </div>

                <PropertyBedrooms count={property.bedrooms}/>

                <PublishedOn date={property.publishedOn}/>

                <img className="property-detail-image"
                     src={property.imgUrl}
                     key={property.imgUrl}
                     alt={property.title}
                />
            </div>
        </div>
    );
}

const HoveredSidebarContent = memo(HoveredSidebarContentComponent);

function PropertyBedrooms({count}: { count: number }): JSX.Element {
    return (
        <div className="property-detail-bedrooms">
            <Bed size={14}/>
            <span>{count} bedroom{count !== 1 ? 's' : ''}</span>
        </div>
    );
}

function PublishedOn({date}: { date: Date }): JSX.Element {
    return (
        <div className="property-details-published-on">
            <Upload size={14}/>
            <span>{date.toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}</span>
        </div>
    );
}

function isAppleDevice() {
    const applePattern = /mac|iphone|ipad|ipod/i;
    return applePattern.test(navigator.platform) || (applePattern.test(navigator.userAgent));
}
