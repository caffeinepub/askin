import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle, Clock } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import { Doubt } from '../backend';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { useNavigate } from '@tanstack/react-router';

interface DoubtCardProps {
  doubtId: Principal;
  doubt: Doubt;
}

export default function DoubtCard({ doubtId, doubt }: DoubtCardProps) {
  const { data: authorProfile } = useGetUserProfile(doubt.author);
  const navigate = useNavigate();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    navigate({ to: '/doubt/$doubtId', params: { doubtId: doubtId.toString() } });
  };

  return (
    <Card
      className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400">
              <AvatarFallback className="text-white font-semibold">
                {authorProfile?.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {authorProfile?.name || 'Anonymous'}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(doubt.timestamp)}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
            <MessageCircle className="w-3 h-3 mr-1" />
            Doubt
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{doubt.description}</p>
        {doubt.attachment && (
          <div className="mt-4">
            <img
              src={doubt.attachment.getDirectURL()}
              alt="Doubt attachment"
              className="w-full max-h-64 object-cover rounded-lg border border-orange-200 dark:border-orange-800"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
