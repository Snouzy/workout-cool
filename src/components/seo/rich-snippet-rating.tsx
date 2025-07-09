import { Star } from "lucide-react";

interface RichSnippetRatingProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export function RichSnippetRating({ rating, reviewCount, className = "" }: RichSnippetRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Stars */}
      <div aria-label={`${rating} out of 5 stars`} className="flex items-center" role="img">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" key={`full-${i}`} />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star className="h-4 w-4 text-gray-300" key={`empty-${i}`} />
        ))}
      </div>

      {/* Rating Text */}
      <span className="text-sm font-medium text-gray-900 dark:text-white">{rating.toFixed(1)}</span>

      {/* Review Count */}
      <span className="text-sm text-gray-500 dark:text-gray-400">
        ({reviewCount} {reviewCount === 1 ? "avis" : "avis"})
      </span>

      {/* Hidden structured data for SEO */}
      <div className="sr-only">
        <span itemProp="ratingValue">{rating}</span>
        <span itemProp="bestRating">5</span>
        <span itemProp="ratingCount">{reviewCount}</span>
      </div>
    </div>
  );
}
