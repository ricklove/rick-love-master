export const createMessageBufferPool = () => {
  const buffers = [] as ArrayBuffer[];

  const TOO_LARGE_RATIO = 1.1;

  const getIndexOfLargerBuffer = (size: number) => buffers.findIndex((b) => b.byteLength > size);

  const addBuffer = (buffer: ArrayBuffer) => {
    // keep sorted: smallest buffer first
    const indexOfLargerBuffer = getIndexOfLargerBuffer(buffer.byteLength);
    if (indexOfLargerBuffer < 0) {
      buffers.push(buffer);
      return;
    }
    buffers.splice(indexOfLargerBuffer, 0, buffer);
  };
  const removeBuffer = (index: number) => {
    buffers.splice(index, 1);
  };

  return {
    addBuffer,
    claimBuffer: (size: number) => {
      const indexOfLargerBuffer = getIndexOfLargerBuffer(size);
      if (indexOfLargerBuffer < 0) {
        return new ArrayBuffer(size);
      }
      const buffer = buffers[indexOfLargerBuffer];
      if (buffer.byteLength > size * TOO_LARGE_RATIO) {
        // if too large, don't use it
        return new ArrayBuffer(size);
      }

      removeBuffer(indexOfLargerBuffer);
      return buffer;
    },
  };
};
export type MessageBufferPool = ReturnType<typeof createMessageBufferPool>;
