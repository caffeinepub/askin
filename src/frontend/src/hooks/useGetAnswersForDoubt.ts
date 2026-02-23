import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { Answer } from '../backend';

export function useGetAnswersForDoubt(doubtId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, Answer]>>({
    queryKey: ['answers', doubtId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnswersForDoubt(doubtId);
    },
    enabled: !!actor && !isFetching,
  });
}
