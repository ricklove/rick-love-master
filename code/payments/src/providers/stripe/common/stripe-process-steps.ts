/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-template */
import { ProcessSteps_CreateSavedPaymentMethod } from '../../../common/process-steps';

// Saved Payments: https://stripe.com/docs/payments/save-and-reuse
export enum ProcessSteps_CreateSavedPaymentMethod_Stripe {
    _02A_Server_GetOrCreateCustomer = ProcessSteps_CreateSavedPaymentMethod._02_Server_SetupSavedPaymentMethod + 1,
    _02B_Server_CreateSetupIntent = ProcessSteps_CreateSavedPaymentMethod._02_Server_SetupSavedPaymentMethod + 2,
    _03A_Client_CollectPaymentDetails = ProcessSteps_CreateSavedPaymentMethod._03_Client_CollectPaymentDetails + 1,
    _04A_Server_ObtainPaymentMethod = ProcessSteps_CreateSavedPaymentMethod._04_Server_ObtainPaymentMethod + 1,
};

export const logProcessStep_CreateSavedPaymentMethod_Stripe = (step: ProcessSteps_CreateSavedPaymentMethod_Stripe, status?: 'BEGIN' | 'END' | 'FAIL', data?: unknown) => {
    // TODO: Implement Universal Logger

    // eslint-disable-next-line no-console
    console.log(`CreateSavedPaymentMethod_Stripe: ${ProcessSteps_CreateSavedPaymentMethod_Stripe[step]} ${status}`, data);
};

export const wrapProcessStep_CreateSavedPaymentMethod_Stripe = async <TResult>(step: ProcessSteps_CreateSavedPaymentMethod_Stripe, execute: () => Promise<TResult>): Promise<TResult> => {
    try {
        logProcessStep_CreateSavedPaymentMethod_Stripe(step, `BEGIN`);

        const result = await execute();
        logProcessStep_CreateSavedPaymentMethod_Stripe(step, `END`);
        return result;
    } catch (error) {
        logProcessStep_CreateSavedPaymentMethod_Stripe(step, `FAIL`, { error });
        throw error;
    }
};
