// A string kept in the URL query (empty values are left out), e.g. a filter that survives
// back/forward and shared links. Changing it also clears the parameters listed in `resets`.
export const useQueryParam = (key: string, { resets = [] as string[] } = {}) => {
  const route = useRoute();
  const router = useRouter();

  return computed({
    get: () => {
      const value = route.query[key];
      return typeof value === 'string' ? value : '';
    },
    set: (value: string) => {
      const cleared = Object.fromEntries(resets.map(name => [name, '']));
      router.replace({ query: withoutEmptyValues({ ...route.query, ...cleared, [key]: value }) });
    },
  });
};

export const usePageParam = () => {
  const param = useQueryParam('page');
  return computed({
    get: () => Math.max(1, Number.parseInt(param.value, 10) || 1),
    set: (page: number) => (param.value = page > 1 ? String(page) : ''),
  });
};
