export default function OverviewSkeleton() {
return (
    <div className="animate-pulse">
    <div className="hidden sm:block rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
            <tr>
            {["ID", "Name", "Issued To", "Issued By", "Date Out"].map((h) => (
                <th key={h} className="px-4 py-3 border-b"><div className="h-3 w-14 bg-gray-200 rounded" /></th>
            ))}
            </tr>
        </thead>
        <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b last:border-0">
                <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    <div className="sm:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
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