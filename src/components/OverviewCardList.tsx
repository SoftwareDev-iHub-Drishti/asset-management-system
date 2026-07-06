"use client";

type OverviewAsset = {
id: string;
name: string;
logs: { issuedTo: string; issuedBy: string; createdAt: string | Date }[];
};

export default function OverviewCardList({ overviewData }: { overviewData: OverviewAsset[] }) {
return (
    <div className="sm:hidden space-y-3">
    {overviewData.map((asset) => {
        const lastLog = asset.logs[0];
        return (
        <div key={asset.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
            <div>
                <div className="font-semibold text-gray-900">{asset.name}</div>
                <div className="font-mono text-xs text-gray-500">{asset.id}</div>
            </div>
            <div className="text-xs text-gray-500">
                {lastLog ? new Date(lastLog.createdAt).toLocaleDateString() : "-"}
            </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1 border-t border-gray-100">
            <div>
                <span className="text-gray-400 block text-xs">Issued To</span>
                <span className="text-blue-600 font-medium">{lastLog?.issuedTo || "Unknown"}</span>
            </div>
            <div>
                <span className="text-gray-400 block text-xs">Issued By</span>
                <span className="text-gray-700">{lastLog?.issuedBy || "-"}</span>
            </div>
            </div>
        </div>
        );
    })}
    </div>
);
}