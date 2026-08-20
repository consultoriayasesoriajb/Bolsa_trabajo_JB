export default function StarRating({ value, onChange, size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-9 h-9" };
  const isInteractive = !!onChange;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        isInteractive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            className="transition-transform hover:scale-110 cursor-pointer"
          >
            <svg
              className={`${sizes[size]} ${star <= value ? "text-[#FDB907]" : "text-gray-200"} transition-colors`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ) : (
          <span key={star} className="cursor-default">
            <svg
              className={`${sizes[size]} ${star <= value ? "text-[#FDB907]" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
        )
      )}
    </div>
  );
}