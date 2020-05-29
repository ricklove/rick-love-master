
export enum ProcessSteps_CreateSavedPaymentMethod {
    _01_Client_BeginCreateSavedPaymentMethod = 100,
    _02_Server_SetupSavedPaymentMethod = 200,
    _03_Client_CollectPaymentDetails = 300,
    _04_Server_ObtainPaymentMethod = 400,
    _05_Server_SavePaymentMethod = 500,
};

export const logProcessStep_CreateSavedPaymentMethod = (step: ProcessSteps_CreateSavedPaymentMethod, status?: 'success' | 'fail', data?: unknown) => {
    // TODO: Implement Universal Logger

    // eslint-disable-next-line no-console
    console.log(`CreateSavedPaymentMethod: ${ProcessSteps_CreateSavedPaymentMethod[step]}`, { data });
};

export const wrapProcessStep_CreateSavedPaymentMethod = async <TResult>(step: ProcessSteps_CreateSavedPaymentMethod, execute: () => Promise<TResult>): Promise<TResult> => {
    try {
        const result = await execute();
        logProcessStep_CreateSavedPaymentMethod(step, `success`);
        return result;
    } catch (error) {
        logProcessStep_CreateSavedPaymentMethod(step, `fail`, { error });
        throw error;
    }
};
