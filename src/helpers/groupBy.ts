export const getGroupBy = <T, K extends PropertyKey>(
  items: T[],
  getKey: (item: T) => K,
): Record<K, T[]> => {
  return items.reduce(
    (acc, el) => {
      const key = getKey(el);
      if (acc[key]) {
        acc[key].push(el);
      } else {
        acc[key] = [el];
      }
      return acc;
    },
    {} as Record<K, T[]>,
  );
};
