import ReloadButton from "./ReloadButton";

export default function Error() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-gray-900 rounded-lg border border-red-400 shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center">
                
                <h3 className="text-lg font-medium text-red-600">Error</h3>
              </div>
              <div className="mt-2 text-sm text-gray-100">
                <p>Ups! Slike se niso mogle naložiti.</p>
              </div>
              <div className="mt-4">
                <ReloadButton/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}