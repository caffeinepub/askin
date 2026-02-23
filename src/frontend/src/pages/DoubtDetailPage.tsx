import { useParams, useNavigate } from '@tanstack/react-router';
import { Principal } from '@icp-sdk/core/principal';
import { useGetAllDoubts } from '../hooks/useGetAllDoubts';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import DoubtCard from '../components/DoubtCard';
import AnswersList from '../components/AnswersList';
import AnswerForm from '../components/AnswerForm';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { UserRole } from '../backend';

export default function DoubtDetailPage() {
  const { doubtId } = useParams({ from: '/doubt/$doubtId' });
  const navigate = useNavigate();
  const { data: doubts, isLoading: doubtsLoading } = useGetAllDoubts();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const doubt = doubts?.find(([id]) => id.toString() === doubtId);
  const isSenior = userProfile?.role === UserRole.Senior;

  if (doubtsLoading || profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doubts
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Doubt not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const [id, doubtData] = doubt;
  const doubtPrincipal = Principal.fromText(doubtId);

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Doubts
      </Button>

      <div className="space-y-6">
        <DoubtCard doubtId={id} doubt={doubtData} />

        {isSenior && (
          <div>
            <AnswerForm doubtId={doubtPrincipal} />
          </div>
        )}

        <AnswersList doubtId={doubtPrincipal} />
      </div>
    </div>
  );
}
