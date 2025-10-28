"use client";

import { useEffect, useState } from "react";

type NewsInfo = {
  id: string;
  title: string;
  url: string;
  source: string;
  time: string;
};

export default function Home() {
  const [topic, setTopic] = useState("technology");
  const [articles, setArticles] = useState<NewsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(""); // cache or fresh
  const [error, setError] = useState("");

  const fetchNews = async (t: string) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`/api/news?topic=${t}`);
      if (!res.ok) throw new Error("Failed to fetch news");

      // Check cache info from server headers
      const fromCache = res.headers.get("x-cache") === "HIT";
      setStatus(fromCache ? "From Cache 🧠" : "Fresh Fetch ⚡");

      const data = await res.json();
setArticles(Array.isArray(data.data) ? data.data : []);

    } catch (err) {
      setError("Could not load news.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(topic);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📰 Latest {topic} News</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic..."
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={() => fetchNews(topic)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch
          </button>
        </div>

        {status && <p className="mb-4 text-sm text-gray-600">{status}</p>}
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.id} className="p-4 border rounded bg-white shadow-sm">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                {a.title}
              </a>
              <p className="text-sm text-gray-500">
                {a.source} — {new Date(a.time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
