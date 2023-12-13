"use client";

import { useFormStatus } from "react-dom";
import { FormProps } from "../interfaces";

export default function Form({ action }: FormProps) {
  let { pending } = useFormStatus();
  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <form
        action={action}
        className="max-w-sm rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            URL slike
          </label>
          <input
            type="url"
            name="image"
            id="image"
            placeholder="example.com/image.jpg"
            className="block w-full rounded-lg border border-gray-500 bg-gray-600 p-2.5 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 ${
            pending ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {pending ? "Loading..." : "Uploadaj"}
        </button>
      </form>
    </div>
  );
}
