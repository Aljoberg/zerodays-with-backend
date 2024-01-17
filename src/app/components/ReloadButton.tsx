// because I wanna render stuff server side as much as possible
"use client";
export default function ReloadButton() {
  return (
    <button
      onClick={() => location.reload()}
      className="w-full rounded-md bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      Probaj še enkrat
    </button>
  );
}
