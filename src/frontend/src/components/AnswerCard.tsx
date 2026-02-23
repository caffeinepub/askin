import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { FileText, Video, Download } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import { Answer } from '../backend';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import RatingStars from './RatingStars';
import RatingInput from './RatingInput';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AnswerCardProps {
  answerId: Principal;
  answer: Answer;
}

export default function AnswerCard({ answerId, answer }: AnswerCardProps) {
  const { data: responderProfile } = useGetUserProfile(answer.responder);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="pb-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400">
              <AvatarFallback className="text-white font-semibold">
                {responderProfile?.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {responderProfile?.name || 'Anonymous'}
              </p>
              <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300 text-xs">
                👨‍🏫 Senior
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RatingStars rating={answer.rating} readonly />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({Number(answer.numRatings)} {Number(answer.numRatings) === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{answer.text}</p>

        {(answer.notes || answer.video) && (
          <div className="flex flex-wrap gap-3">
            {answer.notes && (
              <a
                href={answer.notes.getDirectURL()}
                download
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <img src="/assets/generated/notes-icon.dim_64x64.png" alt="Notes" className="w-5 h-5" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Download Notes</span>
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </a>
            )}
            {answer.video && (
              <div className="w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <img src="/assets/generated/video-icon.dim_64x64.png" alt="Video" className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Explanation</span>
                </div>
                <video
                  controls
                  className="w-full max-h-96 rounded-lg border border-green-200 dark:border-green-800"
                  src={answer.video.getDirectURL()}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}

        {isAuthenticated && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <RatingInput answerer={answer.responder} doubtId={answer.doubtId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
