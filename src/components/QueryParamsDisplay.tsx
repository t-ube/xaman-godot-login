'use client';

import { useSearchParams } from 'next/navigation';

export default function QueryParamsDisplay() {
  const searchParams = useSearchParams();
  const paramsEntries = Array.from(searchParams.entries());

  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Query Parameters:</h2>
      {paramsEntries.length > 0 ? (
        <ul>
          {paramsEntries.map(([key, value]) => (
            <li key={key} className="mb-2">
              <span className="font-semibold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No query parameters found.</p>
      )}
    </div>
  );
}