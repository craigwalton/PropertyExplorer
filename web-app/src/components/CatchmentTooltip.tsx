import './CatchmentTooltip.css';

export function CatchmentTooltip({ catchmentName }: { catchmentName: string | null }) {
    if (!catchmentName) {
        return null;
    }

    return (
        <div className="catchment-tooltip">
            {catchmentName}
        </div>
    );
}
