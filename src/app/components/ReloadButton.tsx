// because I wanna render stuff server side as much as possible
"use client";
export default function ReloadButton() {
    return (
        <button onClick={() => location.reload()} className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
          Probaj še enkrat
        </button>
    )
}