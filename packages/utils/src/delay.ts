
/** Delay an Async Promise for Milliseconds
 * 
 * @param timeoutMS milliseconds to delay
 */
export async function delay(timeoutMS: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeoutMS);
    });
}
