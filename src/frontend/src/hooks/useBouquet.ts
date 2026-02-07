import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Bouquet, Flower, BouquetSecret } from '../backend';

export function useCreateBouquet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      flowers: Flower[];
      wrappingStyle: string;
      ribbonStyle: string;
      cardMessage: string | null;
      creatorName: string | null;
      secret: BouquetSecret | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBouquet(
        params.flowers,
        params.wrappingStyle,
        params.ribbonStyle,
        params.cardMessage,
        params.creatorName,
        params.secret
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bouquets'] });
    },
  });
}

export function useGetBouquet(bouquetId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Bouquet>({
    queryKey: ['bouquet', bouquetId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getBouquet(BigInt(bouquetId));
    },
    enabled: !!actor && !isFetching && !!bouquetId,
    retry: 1,
  });
}

export function useGetAllBouquets() {
  const { actor, isFetching } = useActor();

  return useQuery<Bouquet[]>({
    queryKey: ['bouquets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBouquets();
    },
    enabled: !!actor && !isFetching,
  });
}
