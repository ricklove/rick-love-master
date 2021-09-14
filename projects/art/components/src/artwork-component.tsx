import React from 'react';
import { Artwork } from '@ricklove/art-common';
import { createArtRenderer } from './art-renderer';
import { DivHost } from './div-host';
import { ArtRenderer } from './types';

export const createArtworkComponentLoader = (artwork: Artwork, tokenId: string) => {
  const renderer = createArtRenderer(artwork, tokenId);

  return (props: { config: {} }) => {
    return <ArtworkComponent {...props} renderer={renderer} />;
  };
};

export const ArtworkComponent = (props: { config: {}; renderer: ArtRenderer }) => {
  return <DivHost artRenderer={props.renderer} />;
};
