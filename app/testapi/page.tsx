"use client";

import { useState } from "react";
import { getBibleApiUrl } from "@/lib/bibleUtils";

export default function BibleTest() {
  const [reference, setReference] = useState(""); // referência digitada
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchVerse() {
    if (!reference.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const url = getBibleApiUrl(reference);
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao buscar versículo:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Campo de entrada */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite uma referência (ex: Jo 3.16)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={fetchVerse}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Loader */}
      {loading && <p>Carregando...</p>}

      {/* Resultado */}
      {data && (
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-bold">{data.reference}</h2>
          <p className="italic text-sm mb-2">{data.translation_name}</p>

          {/* Texto completo */}
          <p className="mb-4">{data.text}</p>

          <hr className="my-2" />

          {/* Versículos separados */}
          {data.verses.map((v: any) => (
            <p key={v.verse}>
              <b>{v.verse}</b> {v.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
