'use client';
import { useEffect, useState } from "react";

export default function Stats({ params }) {
  const code = params.code;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/${code}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-medium mb-2">Stats for {data.code}</h2>
      <p><strong>Target URL:</strong> <a className="text-blue-600" href={data.url} target="_blank" rel="noreferrer">{data.url}</a></p>
      <p><strong>Clicks:</strong> {data.clicks}</p>
      <p><strong>Last clicked:</strong> {data.lastClicked ? new Date(data.lastClicked).toLocaleString() : "-"}</p>
      <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>
      <div className="mt-4">
        <a href={'/' + data.code} className="text-sm underline">Open redirect (test)</a>
      </div>
    </div>
  );
}
