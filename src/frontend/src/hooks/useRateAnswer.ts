import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';

interface RateAnswerParams {
  answerer: Principal;
  doubtId: Principal;
  rating: bigint;
}

export function useRateAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ answerer, doubtId, rating }: RateAnswerParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rateAnswer(answerer, doubtId, rating);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.doubtId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
