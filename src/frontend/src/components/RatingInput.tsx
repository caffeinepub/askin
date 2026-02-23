import { useState } from 'react';
import RatingStars from './RatingStars';
import { useRateAnswer } from '../hooks/useRateAnswer';
import { Principal } from '@icp-sdk/core/principal';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2 } from 'lucide-react';

interface RatingInputProps {
  answerer: Principal;
  doubtId: Principal;
}

export default function RatingInput({ answerer, doubtId }: RatingInputProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { mutate: rateAnswer, isPending } = useRateAnswer();

  const handleRate = (rating: number) => {
    if (hasRated || isPending) return;
    setSelectedRating(rating);
    rateAnswer(
      { answerer, doubtId, rating: BigInt(rating) },
      {
        onSuccess: () => {
          setHasRated(true);
        },
      }
    );
  };

  if (hasRated) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-300">
          Thank you for rating this answer!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rate this answer:</p>
      <RatingStars rating={selectedRating} onRate={handleRate} />
      {isPending && <p className="text-xs text-gray-500 dark:text-gray-400">Submitting rating...</p>}
    </div>
  );
}
