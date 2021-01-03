export default <T>(size: number, list: T[]): T[][] => list
  .reduce((chunks, _, i, arr) => {
    if (i % size === 0) chunks.push(arr.slice(i, i + size));
    return chunks;
  }, []);
