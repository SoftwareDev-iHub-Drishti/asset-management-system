"use client";
import LogsTable from "@/components/LogsTable";
import LogsCardList from "@/components/LogsCardList";
import { useState, useEffect } from "react";
import { getSystemLogs } from "../actions";
import { Loader2, ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const res = await getSystemLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      }
      setLoading(false);
    };
    init();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="text-blue-600 w-6 h-6" />
              System Logs
            </h1>
            <p className="text-gray-500 text-sm mt-1">A complete audit trail of all asset movements in the MR Lab.</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Form
          </Link>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p>Loading system logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No logs found</p>
              <p>Asset history will appear here once items are checked in or out.</p>
            </div>
          ) : (
            <>
              <LogsTable logs={logs} />
              <LogsCardList logs={logs} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}