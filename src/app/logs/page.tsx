"use client";
import LogsTable from "@/components/LogsTable";
import LogsCardList from "@/components/LogsCardList";
import LogsSkeleton from "@/components/LogsSkeleton";
import { useState, useEffect, useMemo } from "react";
import { getSystemLogs } from "../actions";
import { ClipboardList, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<"ALL" | "CHECK_OUT" | "CHECK_IN">("ALL");

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

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        log.assetId?.toLowerCase().includes(term) ||
        log.asset?.name?.toLowerCase().includes(term) ||
        log.issuedTo?.toLowerCase().includes(term) ||
        log.issuedBy?.toLowerCase().includes(term);

      return matchesAction && matchesSearch;
    });
  }, [logs, searchTerm, actionFilter]);

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

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by asset name, ID, issued to, or issued by..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as "ALL" | "CHECK_OUT" | "CHECK_IN")}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Actions</option>
            <option value="CHECK_OUT">Checked Out</option>
            <option value="CHECK_IN">Returned</option>
          </select>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <LogsSkeleton />
          ) : logs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No logs found</p>
              <p>Asset history will appear here once items are checked in or out.</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No matching logs</p>
              <p>Try a different search term or filter.</p>
            </div>
          ) : (
            <>
              <LogsTable logs={filteredLogs} />
              <LogsCardList logs={filteredLogs} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}