import { findSeedById } from '@/features/seeds/api/findSeedById';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * Load a seed from the backend using its id.
 *
 * @param seedId the id of the requested seed.
 * @param enabled will disable the backend query if set to false.
 * @param quiet will disable error modals if set to true.
 */
export function useFindSeedById(seedId: number, enabled = true, quiet = false) {
  const { t } = useTranslation(['seeds']);
  const { data, error } = useQuery(['plants/seed', seedId] as const, {
    queryFn: (context) => findSeedById(context.queryKey[1]),
    enabled,
    staleTime: Infinity,
  });

  if (error && !quiet) {
    toast.error(t('seeds:error_fetching_seed'), { autoClose: false });
  }

  return {
    seed: data,
  };
}