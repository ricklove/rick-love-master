import React, { useEffect, useRef } from 'react';
import { Artwork, GlobalArtController } from '@ricklove/art-common';
import { createArtRenderer } from './art-renderer';
import { ArtRenderer } from './types';

export const createArtworkComponentLoader = async (artwork: Artwork, tokenId: string) => {
  const renderer = await createArtRenderer(artwork, tokenId);

  return (props: { config: {} }) => {
    return <ArtworkComponent {...props} renderer={renderer} />;
  };
};

export const ArtworkComponent = (props: { config: {}; renderer: ArtRenderer }) => {
  const size = Math.min(1000, Math.min(window.innerWidth, window.innerHeight));

  return (
    <>
      <div style={{ width: size, height: size, margin: `auto` }}>
        <DivHost artRenderer={props.renderer} />
      </div>
    </>
  );
};

const DivHost = (props: { artRenderer: ArtRenderer }) => {
  const hostElementRef = useRef(null as null | HTMLDivElement);
  const HostElement = useRef({
    Component: () => <div style={{ width: `100%`, height: `100%` }} ref={hostElementRef} />,
  });

  useEffect(() => {
    if (!hostElementRef.current) {
      return;
    }

    // console.log(`DivHost - renderArt`, { hostElementRef: hostElementRef.current, renderArt: props.renderArt });
    hostElementRef.current.innerHTML = ``;
    const r = props.artRenderer.setup(hostElementRef.current, { shouldPlay: false });

    // Global controls
    const globalRemove = GlobalArtController.setup({
      play: r.play,
      pause: r.pause,
      nextFrame: r.nextFrame,
    });

    return () => {
      globalRemove.remove();
      r.destroy();
    };
  }, [hostElementRef.current, props.artRenderer.setup]);

  return (
    <>
      <HostElement.current.Component />
    </>
  );
};
