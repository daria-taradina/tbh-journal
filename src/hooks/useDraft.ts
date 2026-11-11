"use client";

import { useEffect, useState } from "react";

export function useDraft(key: string) {
  const [text, setText] = useState("");

  // load after mount (localStorage doesn't exist during server render)
  useEffect(() => {
    try { setText(localStorage.getItem(key) ?? ""); } catch {}
  }, [key]);

  function update(value: string) {
    setText(value);
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch {}
  }

  function clear() {
    setText("");
    try { localStorage.removeItem(key); } catch {}
  }

  return { text, update, clear };
}