import React, { useRef, useEffect } from 'react';
import { createD3ForceDirectedGraph, D3ForceDirectedGraphNode, D3ForceDirectedGraphLink } from 'code-space-logic/d3/force-directed-graph';
import { toMap } from 'utils/objects';
import { createGetUniqueColor } from 'utils/colors';

export const D3Host = (props: { createD3Svg: (host: { current: HTMLDivElement }) => Promise<void> }) => {
    const hostRef = useRef(null as null | HTMLDivElement);
    useEffect(() => {
        if (!hostRef.current) { return; }
        (async () => {
            await props.createD3Svg(hostRef as { current: HTMLDivElement });
        })();
    }, []);
    return (
        <>
            <div ref={hostRef} />
        </>
    );
};


export const createD3Test = async (host: { current: HTMLDivElement }) => {

    const codeSpaceData = (await import(`../code-space-logic/code-space-data.json`));

    // const nodes: D3ForceDirectedGraphNode[] = [...new Array(100)].map((_, i) => ({
    //     id: `${i}`,
    //     title: `Title ${i}`,
    //     style: { color: `#FF0000` },
    // }));
    // const links: D3ForceDirectedGraphLink[] = nodes.slice(1).map((x, i) => ({
    //     source: nodes[i],
    //     target: nodes[i + 1],
    //     value: i,
    //     style: {
    //         strokeWidth: 1.5,
    //     },
    // }));
    // const data = { nodes, links };
    const getUniqueColor = createGetUniqueColor();
    const nodes: D3ForceDirectedGraphNode[] = codeSpaceData.nodes.map(x => ({ ...x, style: { color: getUniqueColor(x.group) } }));
    const nodesMap = toMap(nodes.map(x => ({ key: x.id, value: x })));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const links: D3ForceDirectedGraphLink[] = codeSpaceData.links
        .filter(x => x.priority <= 10)
        .map(x => ({ source: nodesMap.get(x.source)!, target: nodesMap.get(x.target)!, value: x.priority * x.priority, style: { strokeWidth: 1, color: getUniqueColor(x.priority) } }));
    const data = {
        nodes,
        links,
    };

    const svg = createD3ForceDirectedGraph({
        data,
        width: 1000,
        height: 1000,
    });

    host.current.append(svg);
};
