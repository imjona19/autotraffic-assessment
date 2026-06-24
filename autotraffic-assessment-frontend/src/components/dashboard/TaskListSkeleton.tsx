export default function TaskListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-2 w-1/2" />
          </div>
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}