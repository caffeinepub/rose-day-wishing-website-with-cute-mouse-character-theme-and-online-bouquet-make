import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RoseDayWish } from '../backend';

export function useCreateWish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      senderName: string;
      recipientName: string;
      message: string;
      bouquetId: bigint | null;
      note: string | null;
      gifUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createWish(
        params.senderName,
        params.recipientName,
        params.message,
        params.bouquetId,
        params.note,
        params.gifUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes'] });
    },
  });
}

export function useEditWish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      senderName: string;
      recipientName: string;
      message: string;
      bouquetId: bigint | null;
      note: string | null;
      gifUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editWish(
        params.id,
        params.senderName,
        params.recipientName,
        params.message,
        params.bouquetId,
        params.note,
        params.gifUrl
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wish', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['wishes'] });
    },
  });
}

export function useGetWish(wishId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RoseDayWish>({
    queryKey: ['wish', wishId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getWish(BigInt(wishId));
    },
    enabled: !!actor && !isFetching && !!wishId,
    retry: 1,
  });
}

export function useGetAllWishes() {
  const { actor, isFetching } = useActor();

  return useQuery<RoseDayWish[]>({
    queryKey: ['wishes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWishes();
    },
    enabled: !!actor && !isFetching,
  });
}
