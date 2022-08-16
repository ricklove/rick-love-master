import React, { useEffect, useRef } from 'react';
import { Artwork, GlobalArtController } from '@ricklove/art-common';
import { createArtRenderer } from './art-renderer';
import { ArtRenderer } from './types';

export type ArtworkComponentOptions = { isPaused?: boolean };
export const createArtworkLiveViewLoader = async (
  artwork: Artwork,
  tokenId: string,
  options?: ArtworkComponentOptions,
) => {
  const renderer = await createArtRenderer(artwork, tokenId);

  return (props: { config: {} }) => {
    return <ArtworkLiveView {...props} renderer={renderer} options={options ?? {}} />;
  };
};

export const ArtworkLiveView = (props: { config: {}; renderer: ArtRenderer; options: ArtworkComponentOptions }) => {
  const size = Math.min(1000, Math.min(window.innerWidth, window.innerHeight));

  return (
    <>
      <div style={{ width: size, height: size, margin: `auto` }}>
        <DivHost {...props} />
      </div>
    </>
  );
};

const DivHost = (props: { renderer: ArtRenderer; options: ArtworkComponentOptions }) => {
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
    const r = props.renderer.setup(hostElementRef.current, { shouldPlay: !props.options.isPaused });

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
  }, [hostElementRef.current, props.renderer.setup]);

  return (
    <>
      <HostElement.current.Component />
    </>
  );
};
