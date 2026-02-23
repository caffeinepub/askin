import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import { Doubt } from '../backend';

export function useGetAllDoubts() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, Doubt]>>({
    queryKey: ['doubts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoubts();
    },
    enabled: !!actor && !isFetching,
  });
}
