"use client";

import { ArrowRightLeft } from "lucide-react";

type LogEntry = {
  id: string;
  assetId: string;
  action: string;
  issuedBy: string;
  issuedTo: string;
  notes: string | null;
  createdAt: string | Date;
  asset: { name: string };
};

export default function LogsTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4">Action</th>
            <th className="px-6 py-4">Asset ID</th>
            <th className="px-6 py-4">Asset Name</th>
            <th className="px-6 py-4">Issued To</th>
            <th className="px-6 py-4">Issued By</th>
            <th className="px-6 py-4">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => {
            const isOut = log.action === "CHECK_OUT";
            return (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500">
                  {new Date(log.createdAt).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isOut ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    <ArrowRightLeft className="w-3 h-3" />
                    {isOut ? "CHECKED OUT" : "RETURNED"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-medium text-gray-900">{log.assetId}</td>
                <td className="px-6 py-4 font-medium text-gray-700">{log.asset.name}</td>
                <td className="px-6 py-4 text-blue-600 font-medium">{log.issuedTo}</td>
                <td className="px-6 py-4 text-gray-600">{log.issuedBy}</td>
                <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-xs">
                  {log.notes ? log.notes : <span className="text-gray-300">–</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}