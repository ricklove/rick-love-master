export const getArtHtml = (outputJs: string, artInfo: { importObject: string }) => {
    const outputScript = outputJs
        .replace(`}({}, p5));`, `}(window, window.p5));`)
        .replace(`}({}));`, `}(window));`)
        ;
    const p5Script = `
<script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js"></script>
`;
    const runScript = `
var seedMatch = document.location.search.match(/seed=([^;])/) || document.location.search.match(/tokenId=([^;])/);
var seed = seedMatch && seedMatch[1] || '0';

var createP5 = function(s,host){
    return new p5(s,host);
};

window.${artInfo.importObject}.renderArt(
    document.getElementById('host'),
    seed,
    null,
    createP5
)`;

    const outputHtml = `
<html>
<head>
    <style>
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;  
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    body { 
        background: #000000;
    }
    body, div {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        max-width: 100%;
        max-height: 100%;
    }
    </style>
</head>
<body>

    <div id='host'></div>
    ${p5Script}
    <script>
    ${outputScript}
    ${runScript}
    </script>

</body>
</html>`;

    return outputHtml;
};
