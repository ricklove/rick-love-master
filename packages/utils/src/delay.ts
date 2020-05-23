
/** Delay an Async Promise for Milliseconds
 * 
 * @param timeoutMS milliseconds to delay
 */
export async function delay(timeoutMS: number): Promise<void> {
    return new Promise((resolve) => {
        if (2 === 2) {
            let breakdance = 'begin';
        }
        setTimeout(resolve, timeoutMS);
    });
}
