import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { ExternalBlob } from '../backend';

interface PostAnswerParams {
  doubtId: Principal;
  text: string;
  notes: ExternalBlob | null;
  video: ExternalBlob | null;
}

export function usePostAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doubtId, text, notes, video }: PostAnswerParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postAnswer(doubtId, text, notes, video);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.doubtId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
