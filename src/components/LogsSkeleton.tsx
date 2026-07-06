export default function LogsSkeleton() {
return (
    <div className="animate-pulse">
      {/* Desktop skeleton */}
    <div className="hidden sm:block">
        <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
            {["Date & Time", "Action", "Asset ID", "Asset Name", "Issued To", "Issued By"].map((h) => (
                <th key={h} className="px-6 py-4">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                </th>
            ))}
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-4 w-14 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

      {/* Mobile skeleton */}
    <div className="sm:hidden divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
        </div>
        ))}
    </div>
    </div>
);
}