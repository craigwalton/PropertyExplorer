import {useState} from 'react';
import {Download, Settings as SettingsIcon, Upload, X} from 'lucide-react';
import './Settings.css';
import {downloadLocalStorage, uploadLocalStorage} from "../utils/localStorageManager.ts";
import packageJson from '../../package.json';

export function Settings({centreMapOnSelectedProperty, setCentreMapOnSelectedProperty}: {
    centreMapOnSelectedProperty: boolean;
    setCentreMapOnSelectedProperty: (value: boolean) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleDownload = () => {
        downloadLocalStorage();
    };

    const handleUpload = async () => {
        try {
            setUploadError(null);
            await uploadLocalStorage();
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Failed to upload data');
            console.error('Upload error:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="icon-button"
                title="Settings"
            >
                <SettingsIcon size={18}/>
            </button>

            {isOpen && (
                <>
                    <div className="settings-overlay" onClick={() => setIsOpen(false)}/>
                    <div className="settings-modal">
                        <div className="settings-header">
                            <h2>Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="close-button"
                                title="Close"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                        <div className="settings-content">
                            <div className="settings-section">
                                <h3>Map Behaviour</h3>
                                <label className="settings-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={centreMapOnSelectedProperty}
                                        onChange={(e) => setCentreMapOnSelectedProperty(e.target.checked)}
                                    />
                                    <span>Centre map on selected property</span>
                                </label>
                            </div>
                            <div className="settings-section">
                                <h3>Data Management</h3>
                                <p className="settings-description">
                                    Your notes and property classifications are stored in your browser's local storage.
                                    You may export and import this data below.
                                </p>
                                <div className="settings-actions">
                                    <button
                                        onClick={handleDownload}
                                        className="settings-action-button"
                                    >
                                        <Download size={18}/>
                                        <span>Export data</span>
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        className="settings-action-button"
                                    >
                                        <Upload size={18}/>
                                        <span>Import data</span>
                                    </button>
                                </div>
                                {uploadError && (
                                    <div className="upload-error">
                                        {uploadError}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="settings-footer">
                            <span className="settings-version">Version {packageJson.version}</span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
