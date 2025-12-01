import packageJson from '../../package.json';

// LocalStorage keys - used both in local browser storage and when exporting/importing JSON.
export const PROPERTY_CLASSIFICATIONS_KEY = 'property-classifications' as const;
export const PROPERTY_NOTES_KEY = 'property-notes' as const;
export const FILTER_CLASSIFICATION_SELECTION_KEY = 'filter-classification-selection' as const;
export const SHOW_CATCHMENT_AREAS_KEY = 'show-catchment-areas' as const;

// List all the keys to import and export to JSON.
export interface LocalStorageData {
    [PROPERTY_CLASSIFICATIONS_KEY]: Record<string, string>;
    [PROPERTY_NOTES_KEY]: Record<string, string>;
    [FILTER_CLASSIFICATION_SELECTION_KEY]: string;
    [SHOW_CATCHMENT_AREAS_KEY]: boolean;
}

const STORAGE_KEYS = [
    PROPERTY_CLASSIFICATIONS_KEY,
    PROPERTY_NOTES_KEY,
    FILTER_CLASSIFICATION_SELECTION_KEY,
    SHOW_CATCHMENT_AREAS_KEY,
] as const;

// Also export version & timestamp in case they are useful for debugging or migrating data.
export interface ExportData extends Partial<LocalStorageData> {
    appVersion: string;
    exportedAt: string;
}

export function exportLocalStorage(): string {
    const data: ExportData = {
        appVersion: packageJson.version,
        exportedAt: new Date().toISOString(),
    };

    STORAGE_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            data[key] = JSON.parse(value);
        }
    });

    return JSON.stringify(data, null, 2);
}

export function downloadLocalStorage(): void {
    const jsonString = exportLocalStorage();
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString()
        .replace(/T/, '-')
        .replace(/:/g, '-')
        .slice(0, 19);

    link.href = url;
    link.download = `property-explorer-data-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function importLocalStorage(jsonString: string): void {
    // TODO: Consider validating the loaded JSON.
    const data = JSON.parse(jsonString) as ExportData;

    STORAGE_KEYS.forEach(key => {
        if (key in data) {
            localStorage.setItem(key, JSON.stringify(data[key]));
        }
    });

    // Reload to ensure all components pick up the new data
    window.location.reload();
}

export function uploadLocalStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonString = event.target?.result as string;
                    importLocalStorage(jsonString);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        };

        input.click();
    });
}
