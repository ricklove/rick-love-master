import React, { useEffect, useState } from 'react';
import { C } from 'controls-react';
import { useDebounce } from 'utils-react/hooks';
import { art_circles } from './circles';
import { art_layersOfTheOnionsSoul } from './layers-of-the-onions-soul';
import { P5Viewer } from './p5-viewer';

export const ArtGallery = (props: {}) => {
    const artItems = [
        art_circles,
        art_layersOfTheOnionsSoul,
    ];

    const [art, setArt] = useState(artItems[0]);
    const [hash, setHash] = useState(`hash`);
    const [renderArt, setRenderArt] = useState({ renderArt: (hostElement: HTMLDivElement) => { return { remove: () => { } }; } });

    const { debounce } = useDebounce(50);

    const changeHash = (value: string) => {
        setHash(value);

        debounce(() => {
            setRenderArt({ renderArt: (hostElement) => art.renderArt(hostElement, value) });
        });
    };
    useEffect(() => changeHash(`hash`), [art]);

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
                    <C.Input_Text value={hash} onChange={changeHash} />
                </C.View_FieldRow>
            </C.View_Form>

            <C.Text_FormTitle>{art.title}</C.Text_FormTitle>
            <C.Text_FormTitle>{art.artist}</C.Text_FormTitle>
            <C.Text_FormTitle>{art.description}</C.Text_FormTitle>
            <P5Viewer renderArt={renderArt.renderArt} />
        </C.View_Panel>
    );
};
