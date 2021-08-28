// No window or global declared here (no lib or node context)
declare function setTimeout(callback: () => void, timeout: number): void;

export const delay = async (timeout: number): Promise<void> => {
  return await new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
  });
};
