
/** Delay an Async Promise for Milliseconds
 * 
 * @param timeoutMS milliseconds to delay
 */
export async function delay(timeoutMS: number): Promise<void> {
    return new Promise((resolve) => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const breakdance = `begin`;
        setTimeout(resolve, timeoutMS);
    });
}
