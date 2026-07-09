"use client";

type OverviewAsset = {
  id: string;
  name: string;
  logs: { issuedTo: string; issuedBy: string; notes: string | null; createdAt: string | Date }[];
};

export default function OverviewTable({ overviewData }: { overviewData: OverviewAsset[] }) {
  return (
    <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-100 text-gray-800 font-semibold">
          <tr>
            <th className="px-4 py-3 border-b">ID</th>
            <th className="px-4 py-3 border-b">Name</th>
            <th className="px-4 py-3 border-b">Issued To</th>
            <th className="px-4 py-3 border-b">Issued By</th>
            <th className="px-4 py-3 border-b">Date Out</th>
            <th className="px-4 py-3 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          {overviewData.map((asset) => {
            const lastLog = asset.logs[0];
            return (
              <tr key={asset.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{asset.id}</td>
                <td className="px-4 py-3">{asset.name}</td>
                <td className="px-4 py-3 font-medium text-blue-600">{lastLog?.issuedTo || "Unknown"}</td>
                <td className="px-4 py-3">{lastLog?.issuedBy || "-"}</td>
                <td className="px-4 py-3">{lastLog ? new Date(lastLog.createdAt).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 whitespace-normal max-w-xs">
                  {lastLog?.notes ? lastLog.notes : <span className="text-gray-300">–</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}