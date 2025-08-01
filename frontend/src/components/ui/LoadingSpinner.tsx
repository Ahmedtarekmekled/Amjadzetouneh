export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200"></div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0"></div>
      </div>
    </div>
  );
}
