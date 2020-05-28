import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';

export type ComponentTestsPageData = {
    testName: 'stripe';
};

export const ComponentTestsPage = (props: { data: ComponentTestsPageData }) => {
    return (
        <Layout>
            <SEO title={`Component Test: ${props.data.testName}`} />
            <TestComponentAuto data={props.data} />
        </Layout>
    );
};

export const testComponentsAuto = [
    { name: `stripe`, load: async () => (await import(`payments/providers/stripe/client-test/stripe-example`)).StripeExamplePage },
];

export const TestComponentAuto = (props: { data: ComponentTestsPageData }) => {
    const { testName } = props.data;
    const test = testComponentsAuto.find(x => x.name === testName);

    const { LoadedComponent, load } = useLoadable(test?.load ?? (async () => (await import(`./component-tests-not-found`)).EmptyComponent));
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LoadedComponent && <LoadedComponent />}
            {!test && (
                <>
                    <h1>TEST NOT FOUND</h1>
                    <p>testName: {props.data.testName}</p>
                </>
            )}
        </div>
    );
};

// Manual Register:
export const testComponents = [] as { name: string, Component: () => JSX.Element }[];
export const TestComponent = (props: { data: ComponentTestsPageData }) => {
    const { testName } = props.data;

    const test = testComponents.find(x => x.name === testName);
    if (test) {
        return <test.Component />;
    }

    return (
        <>
            <h1>TEST NOT FOUND</h1>
            <p>testName: {props.data.testName}</p>
        </>
    );
};

// Register components
export const TestComponent_Stripe = () => {
    const { LoadedComponent, load } = useLoadable(async () => (await import(`payments/providers/stripe/client-test/stripe-example`)).StripeExamplePage);
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LoadedComponent && <LoadedComponent />}
        </div>
    );
};
testComponents.push({ name: `stripe`, Component: TestComponent_Stripe });
