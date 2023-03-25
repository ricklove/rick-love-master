import { MessageBufferKind } from './message-type';

// This prevents GC of the buffer
const MESSAGE_BUFFER_TRANSFER = true;

export const createMessageBufferPool = (poster: { postMessage: (message: unknown) => void }) => {
  const buffers = [] as ArrayBuffer[];

  const TOO_LARGE_RATIO = 1.1;

  const getIndexOfLargerBuffer = (size: number) => buffers.findIndex((b) => b.byteLength >= size);

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
    addReturnedBuffer: (buffer: ArrayBuffer) => {
      //   console.log(`addReturnedBuffer`, { buffers, buffer });
      addBuffer(buffer);
    },
    returnBuffer: (buffer: ArrayBuffer) => {
      if (MESSAGE_BUFFER_TRANSFER) {
        // send back to other thread (since this size is useless for this thread)
        // console.log(`returnBuffer - sending back`, { buffers, buffer });

        const i32Buffer = new Int32Array(buffer);
        i32Buffer[0] = MessageBufferKind.returnedBuffer;

        const postWithTransfer = poster as { postMessage: (message: unknown, transfer: ArrayBuffer[]) => void };
        postWithTransfer.postMessage(buffer, [buffer]);
      } else {
        // let this buffer go because it won't be the right size to reuse on this thread
        console.log(`returnBuffer - not sending back - creating ${buffer.byteLength} bytes of GARBAGE`, {
          buffers,
          buffer,
        });
        // addBuffer(buffer);
      }
    },
    claimBuffer: (size: number) => {
      const indexOfLargerBuffer = getIndexOfLargerBuffer(size);
      if (indexOfLargerBuffer < 0) {
        console.log(`claimBuffer: no buffer large enough`, { size, buffers });
        return new ArrayBuffer(size);
      }
      const buffer = buffers[indexOfLargerBuffer];
      if (buffer.byteLength > size * TOO_LARGE_RATIO) {
        console.log(`claimBuffer: buffer too large`, { size, buffer, buffers });
        return new ArrayBuffer(size);
      }

      //   console.log(`claimBuffer: reusing buffer`, { size, buffer, buffers });
      removeBuffer(indexOfLargerBuffer);
      return buffer;
    },
    postMessage: (buffer: ArrayBuffer) => {
      if (MESSAGE_BUFFER_TRANSFER) {
        const postWithTransfer = poster as { postMessage: (message: unknown, transfer: ArrayBuffer[]) => void };
        postWithTransfer.postMessage(buffer, [buffer]);
      } else {
        poster.postMessage(buffer);
        addBuffer(buffer);
      }
    },
  };
};
export type MessageBufferPool = ReturnType<typeof createMessageBufferPool>;
