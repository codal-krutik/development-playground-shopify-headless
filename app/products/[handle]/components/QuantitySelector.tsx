"use client";

import { useState } from "react";

export default function QuantitySelector({
  name = "quantity",
  defaultValue = 1,
}: {
  name?: string;
  defaultValue?: number;
}) {
  const [qty, setQty] = useState(defaultValue);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="w-10 h-10 border rounded text-lg"
      >
        −
      </button>

      <input name={name} value={qty} readOnly className="w-16 text-center border rounded py-2" />

      <button type="button" onClick={() => setQty((q) => q + 1)} className="w-10 h-10 border rounded text-lg">
        +
      </button>
    </div>
  );
}
