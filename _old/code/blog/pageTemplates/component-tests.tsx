import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';
import { componentTestList } from './component-tests-list';


export type ComponentTestsPageData = {
    testName: string;
};

export const ComponentTestsPage = (props: { data: ComponentTestsPageData }) => {
    return (
        <Layout>
            <SEO title={`Component Test: ${props.data.testName}`} />
            <TestComponentAuto data={props.data} />
        </Layout>
    );
};


export const TestComponentAuto = (props: { data: ComponentTestsPageData }) => {
    const { testName } = props.data;
    const test = componentTestList.find(x => x.name === testName);

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
