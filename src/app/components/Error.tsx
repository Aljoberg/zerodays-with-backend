import ReloadButton from "./ReloadButton";

export default function Error() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="container mx-auto">
        <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-red-400 bg-gray-900 shadow-md">
          <div className="p-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-red-600">Error</h3>
            </div>
            <div className="mt-2 text-sm text-gray-100">
              <p>Ups! Slike se niso mogle naložiti.</p>
            </div>
            <div className="mt-4">
              <ReloadButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
