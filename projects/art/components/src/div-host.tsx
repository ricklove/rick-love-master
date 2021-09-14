import React, { useEffect, useRef } from 'react';
import { ArtRenderer } from './types';

export const DivHost = (props: { artRenderer: ArtRenderer }) => {
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
    const { destroy } = props.artRenderer.setup(hostElementRef.current);
    return () => {
      destroy();
    };
  }, [hostElementRef.current, props.artRenderer.setup]);

  return (
    <>
      <HostElement.current.Component />
    </>
  );
};
