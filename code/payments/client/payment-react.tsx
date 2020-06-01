/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react';
import { theme } from 'themes/theme';
import { useAutoLoadingError } from 'utils-react/hooks';
import { C } from 'controls-react';
import { formatDate } from 'utils/dates';
import { PaymentMethodClientInfo, PaymentMethodStorageKey, PaymentProviderSavedPaymentMethodClientSetupToken, PaymentProviderSavedPaymentMethodClientToken, PaymentTransaction } from '../common/types';
import { createPaymentClientComponents_stripe } from '../providers/stripe/client/stripe-payment-react';
import { PaymentClientComponents, PaymentComponentStyle } from '../common/types-react';

export const createPaymentClientComponents = (params: { stripePublicKey: string }): PaymentClientComponents => {

    const compStripe = createPaymentClientComponents_stripe(params);

    const components: PaymentClientComponents = {
        AppWrapperComponent: ({ children }) => {
            if (!compStripe.AppWrapperComponent) { return (<>{children}</>); }
            return (<compStripe.AppWrapperComponent>{children}</compStripe.AppWrapperComponent>);
        },
        PaymentMethodEntryComponent: (props) => {
            return (
                <compStripe.PaymentMethodEntryComponent {...props} />
            );
        },
    };

    return components;
};

export type PaymentViewServerAccess = PaymentMethodViewServerAccess & PaymentHistoryViewServerAccess;
export const createPaymentClientComponents_extra = (params: { stripePublicKey: string, serverAccess: PaymentViewServerAccess }) => {
    const comp = createPaymentClientComponents(params);
    const compExtra = {
        PaymentMethodView: (props: {}) => (<PaymentMethodView comp={comp} serverAccess={params.serverAccess} title='Payment Methods' />),
        PaymentHistoryView: (props: {}) => (<PaymentHistoryView comp={comp} serverAccess={params.serverAccess} title='Payment History' />),
    };

    return {
        ...comp,
        ...compExtra,
    };
};

export type PaymentViewServerAccess_WithDebug = PaymentMethodViewServerAccess & PaymentHistoryViewServerAccess & PaymentDebugViewServerAccess;
export const createPaymentClientComponents_withDebug = (params: { stripePublicKey: string, serverAccess: PaymentViewServerAccess_WithDebug }) => {
    const compExtra = createPaymentClientComponents_extra(params);
    const compDebug = {
        PaymentDebugView: (props: { onPurchase?: () => void }) => (<PaymentDebugView comp={compExtra} serverAccess={params.serverAccess} title='Payment Debug' onPurchase={props.onPurchase} />),
    };

    return {
        ...compExtra,
        ...compDebug,
    };
};

type PaymentMethodViewServerAccess = {
    getPaymentMethods: () => Promise<PaymentMethodClientInfo[]>;
    deletePaymentMethod: (key: PaymentMethodStorageKey) => Promise<void>;
    onSetupPayment: () => Promise<PaymentProviderSavedPaymentMethodClientSetupToken>;
    onPaymentMethodReady: (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => Promise<void>;
};
const PaymentMethodView = (props: {
    comp: PaymentClientComponents;
    serverAccess: PaymentMethodViewServerAccess;
    title: string;
}) => {
    const [style, setStyle] = useState({
        textPadding: 4,
        elementPadding: 4,
        buttonAlignment: `right`,
        borderRadius: 4,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background_field,
        textColor: theme.colors.text,
        buttonText: `Save`,
    } as PaymentComponentStyle);

    const { loading, error, doWork } = useAutoLoadingError();

    const [paymentMethods, setPaymentMethods] = useState(null as null | PaymentMethodClientInfo[]);
    const populatePaymentMethods = () => doWork(async () => {
        const result = await props.serverAccess.getPaymentMethods();
        setPaymentMethods(result);
    });

    const deletePaymentMethod = (key: PaymentMethodStorageKey) => doWork(async () => {
        await props.serverAccess.deletePaymentMethod(key);
        populatePaymentMethods();
    });

    const [setupToken, setSetupToken] = useState(null as null | PaymentProviderSavedPaymentMethodClientSetupToken);
    const setupPayment = () => doWork(async (stopIfObsolete) => {
        const result = await props.serverAccess.onSetupPayment();
        stopIfObsolete();
        console.log(`setupPayment`, { result });
        setSetupToken(result);
    });

    const onPaymentMethodReady = (paymentMethodToken: PaymentProviderSavedPaymentMethodClientToken) => doWork(async () => {
        await props.serverAccess.onPaymentMethodReady(paymentMethodToken);
        setSetupToken(null);
        populatePaymentMethods();
    });


    useEffect(() => {
        populatePaymentMethods();
    }, []);

    return (
        <>
            <C.View_Form>
                <C.Text_FormTitle>{props.title}</C.Text_FormTitle>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                {paymentMethods && paymentMethods.map(x => (
                    <C.View_FieldRow key={x.key}>
                        <C.Text_FieldLabel>{x.title}</C.Text_FieldLabel>
                        <C.Text_FieldLabel>{`Expires: ${(`${x.expiration.month}`).padStart(2, `0`)}/${x.expiration.year}`}</C.Text_FieldLabel>
                        <C.Button_FieldInline onPress={() => deletePaymentMethod(x.key)}>Remove</C.Button_FieldInline>
                    </C.View_FieldRow>
                ))}
                {!setupToken && <C.View_FormActionRow><C.Button_FormAction onPress={setupPayment}>Add Payment Method</C.Button_FormAction></C.View_FormActionRow>}
                {setupToken && <props.comp.PaymentMethodEntryComponent style={style} paymentMethodSetupToken={setupToken} onPaymentMethodReady={onPaymentMethodReady} />}
            </C.View_Form>
        </>
    );
};


type PaymentHistoryViewServerAccess = {
    getPayments: () => Promise<PaymentTransaction[]>;
};
const PaymentHistoryView = (props: {
    comp: PaymentClientComponents;
    serverAccess: PaymentHistoryViewServerAccess;
    title: string;
}) => {
    const { loading, error, doWork } = useAutoLoadingError();

    const [payments, setPayments] = useState(null as null | PaymentTransaction[]);
    const populatePayments = () => doWork(async (stopIfObsolete) => {
        const result = await props.serverAccess.getPayments();
        stopIfObsolete();
        setPayments(result);
    });

    useEffect(() => {
        populatePayments();
    }, []);

    return (
        <>
            <C.View_Form>
                <C.Text_FormTitle>{props.title}</C.Text_FormTitle>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                {payments && payments.map(x => (
                    <C.View_FieldRow key={`${x.created}`}>
                        <C.Text_FieldLabel>{`Created: ${formatDate(x.created)}`}</C.Text_FieldLabel>
                        <C.Text_FieldLabel>{`$${x.amount.usdCents / 100}`}</C.Text_FieldLabel>
                    </C.View_FieldRow>
                ))}
            </C.View_Form>
        </>
    );
};


type PaymentDebugViewServerAccess = {
    onMakePurchase: (amount: number) => Promise<void>;
};
const PaymentDebugView = (props: {
    comp: PaymentClientComponents;
    serverAccess: PaymentDebugViewServerAccess;
    title: string;
    onPurchase?: () => void;
}) => {
    const { loading, error, doWork } = useAutoLoadingError();

    const [purchaseAmount, setPurchaseAmount] = useState(100);
    const makePurchase = () => doWork(async () => {
        await props.serverAccess.onMakePurchase(purchaseAmount);
        props.onPurchase?.();
    });

    return (
        <>
            <C.View_Form>
                <C.Text_FormTitle>Make Purchase</C.Text_FormTitle>
                <C.Text_FormTitle>{props.title}</C.Text_FormTitle>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                <C.View_FieldRow>
                    <C.Text_FieldLabel>Amount $</C.Text_FieldLabel>
                    <C.Input_Currency value={purchaseAmount} onChange={(value) => setPurchaseAmount(value)} />
                    <C.Button_FieldInline onPress={() => makePurchase()} >Purchase</C.Button_FieldInline>
                </C.View_FieldRow>
            </C.View_Form>
        </>
    );
};
