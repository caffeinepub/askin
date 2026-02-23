import { useGetAllDoubts } from '../hooks/useGetAllDoubts';
import DoubtCard from './DoubtCard';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { MessageCircle } from 'lucide-react';

export default function DoubtsFeed() {
  const { data: doubts, isLoading, error } = useGetAllDoubts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load doubts. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!doubts || doubts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
          <MessageCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No doubts yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Be the first to post a doubt!</p>
      </div>
    );
  }

  const sortedDoubts = [...doubts].sort((a, b) => Number(b[1].timestamp - a[1].timestamp));

  return (
    <div className="space-y-4">
      {sortedDoubts.map(([id, doubt]) => (
        <DoubtCard key={id.toString()} doubtId={id} doubt={doubt} />
      ))}
    </div>
  );
}
