'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function fetchLinks(setLinks, setLoading) {
  setLoading(true);
  fetch("/api/links")
    .then((r) => r.json())
    .then((data) => {
      setLinks(data || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}

export default function Page() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchLinks(setLinks, setLoading);
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!url) {
      setError("URL is required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined }),
    });
    if (res.status === 201) {
      setUrl("");
      setCode("");
      fetchLinks(setLinks, setLoading);
    } else if (res.status === 409) {
      const body = await res.json();
      setError(body.error || "Code exists");
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Error creating");
    }
    setSaving(false);
  }

  async function handleDelete(c) {
    if (!confirm("Delete link " + c + "?")) return;
    await fetch("/api/" + c, { method: "DELETE" });
    fetchLinks(setLinks, setLoading);
  }

  async function handleClickCode(c) {
    await fetch("/api/links/" + c, { method: "PUT" });
    router.push(`/code/${c}`)
  }
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">TinyLink Dashboard</h1>

        {/* Form Card */}
        <form
          onSubmit={handleAdd}
          className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-200"
        >
          <div className="flex gap-3 items-center">
            <input
              placeholder="https://example.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              placeholder="custom code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              disabled={saving}
              className={`px-5 py-3 rounded-lg text-white font-medium shadow 
              ${saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
            `}
            >
              {saving ? "Saving..." : "Add"}
            </button>
          </div>

          {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
        </form>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          {loading ? (
            <p className="text-gray-600 animate-pulse">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-2 font-semibold text-gray-700">Code</th>
                  <th className="text-left p-2 font-semibold text-gray-700">
                    Target URL
                  </th>
                  <th className="p-2 font-semibold text-gray-700">Clicks</th>
                  <th className="p-2 font-semibold text-gray-700">Last Clicked</th>
                  <th className="p-2 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {links.map((l) => (
                  <tr
                    key={l.code}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Code */}
                    <td className="p-2">
                      <button
                        onClick={() => handleClickCode(l.code)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {l.code}
                      </button>
                    </td>

                    {/* URL */}
                    <td className="p-2 max-w-md">
                      <span className="truncate block text-gray-700">
                        {l.url}
                      </span>
                    </td>

                    {/* Clicks */}
                    <td className="text-center p-2 font-semibold text-gray-700">
                      {l.clicks}
                    </td>

                    {/* Last clicked */}
                    <td className="text-center p-2 text-gray-600">
                      {l.lastClicked
                        ? new Date(l.lastClicked).toLocaleString()
                        : "-"}
                    </td>

                    {/* Actions */}
                    <td className="text-center p-2 flex gap-3 justify-center">
                      <button
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            window.location.origin + "/code/" + l.code
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => handleDelete(l.code)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {links.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-gray-500 p-5 text-center"
                    >
                      No links created yet 🚀
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}