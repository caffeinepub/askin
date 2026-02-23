import { useGetAnswersForDoubt } from '../hooks/useGetAnswersForDoubt';
import AnswerCard from './AnswerCard';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';

interface AnswersListProps {
  doubtId: Principal;
}

export default function AnswersList({ doubtId }: AnswersListProps) {
  const { data: answers, isLoading, error } = useGetAnswersForDoubt(doubtId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load answers. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!answers || answers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No answers yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Be the first to help!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
        <span>Answers ({answers.length})</span>
      </h2>
      {answers.map(([id, answer]) => (
        <AnswerCard key={id.toString()} answerId={id} answer={answer} />
      ))}
    </div>
  );
}
