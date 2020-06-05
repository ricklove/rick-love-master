import * as d3 from 'd3';

export type D3ForceDirectedGraphNode = {
    id: string;
    title: string;

    style: { color: string };

} & d3.SimulationNodeDatum;
export type D3ForceDirectedGraphLink = {
    source: D3ForceDirectedGraphNode;
    target: D3ForceDirectedGraphNode;
    /** Relative Length Distance */
    value: number;

    style: {
        color: string;
        strokeWidth: number;
    };

    index?: number;
};
export const createD3ForceDirectedGraph = ({
    data,
    width,
    height,
}: {
    data: {
        nodes: D3ForceDirectedGraphNode[];
        links: D3ForceDirectedGraphLink[];
    };
    width: number;
    height: number;
}) => {
    const { nodes } = data;
    const { links } = data;

    const simulation = d3.forceSimulation(nodes)
        .force(`link`, d3.forceLink<D3ForceDirectedGraphNode, D3ForceDirectedGraphLink>(links))
        .force(`charge`, d3.forceManyBody().strength(-100))
        // .force(`center`, d3.forceCenter(width / 2, height / 2))
        .force(`x`, d3.forceX())
        .force(`y`, d3.forceY())
        ;

    // function setupDrag() {
    //     function dragstarted(node: D3ForceDirectedGraphNode) {
    //         const d = node;
    //         if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    //         d.fx = d.x;
    //         d.fy = d.y;
    //     }

    //     function dragged(node: D3ForceDirectedGraphNode) {
    //         const d = node;
    //         d.fx = d3.event.x;
    //         d.fy = d3.event.y;
    //     }

    //     function dragended(node: D3ForceDirectedGraphNode) {
    //         const d = node;
    //         if (!d3.event.active) simulation.alphaTarget(0);
    //         d.fx = null;
    //         d.fy = null;
    //     }

    //     return d3.drag()
    //         .on(`start`, dragstarted)
    //         .on(`drag`, dragged)
    //         .on(`end`, dragended);
    // };

    const svg = d3.create(`svg`)
        .attr(`viewBox`, [-width / 2, -height / 2, width, height] as unknown as string);

    const link = svg.append(`g`)
        // .attr(`stroke`, `#00FF00`)
        .attr(`stroke-opacity`, 0.6)
        .selectAll(`line`)
        .data(links)
        .join(`line`)
        .attr(`stroke`, d => d.style.color)
        .attr(`stroke-width`, d => d.style.strokeWidth);

    const node = svg.append(`g`)
        .attr(`stroke`, `#fff`)
        .attr(`stroke-width`, 1.5)
        .selectAll(`circle`)
        .data(nodes)
        .join(`circle`)
        .attr(`r`, 5)
        .attr(`fill`, d => d.style.color)
        ;
    // .call(drag(simulation));

    node.append(`title`)
        .text(d => d.title);

    simulation.on(`tick`, () => {
        link
            .attr(`x1`, d => d.source.x || 0)
            .attr(`y1`, d => d.source.y || 0)
            .attr(`x2`, d => d.target.x || 0)
            .attr(`y2`, d => d.target.y || 0);

        node
            .attr(`cx`, d => d.x || 0)
            .attr(`cy`, d => d.y || 0);
    });

    // invalidation.then(() => simulation.stop());

    return svg.node()!;
};

//   );
// main.variable(observer("data")).define("data", ["FileAttachment"], function (FileAttachment) {
//     return (
//         FileAttachment("miserables.json").json()
//     )
// });
// main.variable(observer("height")).define("height", function () {
//     return (
//         600
//     )
// });
// main.variable(observer("color")).define("color", ["d3"], function (d3) {
//     const scale = d3.scaleOrdinal(d3.schemeCategory10);
//     return d => scale(d.group);
// }
// );
