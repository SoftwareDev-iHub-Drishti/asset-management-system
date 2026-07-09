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

export default function LogsCardList({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="sm:hidden divide-y divide-gray-100">
      {logs.map((log) => {
        const isOut = log.action === "CHECK_OUT";
        return (
          <div key={log.id} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                isOut ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                <ArrowRightLeft className="w-3 h-3" />
                {isOut ? "CHECKED OUT" : "RETURNED"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
            <div className="font-semibold text-gray-900">
              {log.asset.name} <span className="font-mono text-gray-500 text-sm">({log.assetId})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <div>
                <span className="text-gray-400 block text-xs">Issued To</span>
                <span className="text-blue-600 font-medium">{log.issuedTo}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Issued By</span>
                <span className="text-gray-700">{log.issuedBy}</span>
              </div>
            </div>
            {log.notes && (
              <div className="text-sm pt-1 border-t border-gray-100 mt-1">
                <span className="text-gray-400 block text-xs">Notes</span>
                <span className="text-gray-700">{log.notes}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}