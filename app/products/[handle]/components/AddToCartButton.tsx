"use client";

export default function AddToCartButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className={`mt-6 w-full rounded-lg px-6 py-3 text-sm font-medium transition
        ${disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
    >
      Add to Cart
    </button>
  );
}
