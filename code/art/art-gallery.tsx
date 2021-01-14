import React, { useState } from 'react';
import { C } from 'controls-react';
import { renderArt_circles } from './circles';
import { renderArt_layersOfTheOnionsSoul } from './layers-of-the-onions-soul';
import { P5Viewer } from './p5-viewer';

export const ArtGallery = (props: {}) => {
    const artItems = [
        { title: `Circles`, renderArt: renderArt_circles },
        { title: `Layers of the Onion's Soul`, renderArt: renderArt_layersOfTheOnionsSoul },
    ];

    const [art, setArt] = useState(artItems[0]);
    const [hash, setHash] = useState(`hash`);

    return (
        <C.View_Panel>
            <C.View_Form>
                {artItems.map(x => (
                    <React.Fragment key={x.title}>
                        <div style={{ paddingBottom: 4 }}>
                            <C.Button_FormAction onPress={() => setArt(x)}>{x.title}</C.Button_FormAction>
                        </div>
                    </React.Fragment>
                ))}
                <C.View_FieldRow>
                    <C.Text_FormTitle>Enter a hash:</C.Text_FormTitle>
                    <C.Input_Text value={hash} onChange={setHash} />
                </C.View_FieldRow>
            </C.View_Form>

            <P5Viewer key={art.title + hash} art={{ renderArt: (hostElement) => art.renderArt(hostElement, hash) }} />
        </C.View_Panel>
    );
};
