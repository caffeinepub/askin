import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
}

export default function RatingStars({ rating, readonly = false, onRate }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
