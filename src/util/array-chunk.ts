/**
 * Split an array into chunks of a given size
 *
 * @param size The size of the chunks
 * @param list The array to split
 */
export default <T>(size: number, list: T[]): T[][] => list
  .reduce((chunks, _, i, arr) => {
    if (i % size === 0) chunks.push(arr.slice(i, i + size));
    return chunks;
  }, []);
