import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface PostDoubtParams {
  description: string;
  attachment: ExternalBlob | null;
}

export function usePostDoubt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ description, attachment }: PostDoubtParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postDoubt(description, attachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
}
