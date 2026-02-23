import { useGetLeaderboard } from '../hooks/useGetLeaderboard';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Principal } from '@icp-sdk/core/principal';

function LeaderboardRow({ rank, userId, points }: { rank: number; userId: Principal; points: bigint }) {
  const { data: profile } = useGetUserProfile(userId);

  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = () => {
    if (rank <= 3) {
      return (
        <Badge
          variant="outline"
          className={`${
            rank === 1
              ? 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
              : rank === 2
                ? 'border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                : 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
          }`}
        >
          #{rank}
        </Badge>
      );
    }
    return <span className="text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  return (
    <TableRow className={rank <= 3 ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          {getRankIcon()}
          {getRankBadge()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400">
            <AvatarFallback className="text-white font-semibold">
              {profile?.name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 dark:text-gray-100">{profile?.name || 'Anonymous'}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          {Number(points)} points
        </Badge>
      </TableCell>
    </TableRow>
  );
}

export default function LeaderboardTable() {
  const { data: leaderboard, isLoading, error } = useGetLeaderboard();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load leaderboard. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
          <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No rankings yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Start answering doubts to earn points!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <TableHead className="w-32">Rank</TableHead>
            <TableHead>Senior</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId.toString()}
              rank={index + 1}
              userId={entry.userId}
              points={entry.points}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
