function mapAndDeduplicate<T, U>(
    arr: T[],
    mapFn: (item: T) => U,
    keyFn?: (item: U) => any
  ): U[] {
    const mapped = arr.map(mapFn);
    if (!keyFn) return [...new Set(mapped)]; // For primitives
  
    const seen = new Set();
    return mapped.filter(item => {
      const key = keyFn(item);
      const isDuplicate = seen.has(key);
      if (!isDuplicate) seen.add(key);
      return !isDuplicate;
    });
  }
  
  export default mapAndDeduplicate;
