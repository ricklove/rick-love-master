import React, { useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import html2canvas from 'html2canvas';
import * as THREE from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { logger } from '../../utils/logger';

// Prevents html2canvas warnings
// @todo maybe remove this if it causes performance issues?
type GetContetFun = typeof HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = ((origFn: GetContetFun) => {
  return function f(type, attribs) {
    attribs = attribs || {};
    attribs.preserveDrawingBuffer = true;
    //@ts-ignore
    return origFn.call(this, type, attribs);
  } as GetContetFun;
})(HTMLCanvasElement.prototype.getContext) as unknown as GetContetFun;

export const HtmlObject = ({
  children,
  position,
  width,
  height,
  color = `transparent`,
}: {
  children: JSX.Element;
  position: [number, number, number];
  width: number;
  height: number;
  color?: string;
}) => {
  const { camera, size: viewSize, gl } = useThree();

  const container = useMemo(() => {
    const c = document.querySelector(`#htmlContainer`);
    if (c) {
      return c;
    }

    const node = document.createElement(`div`);
    node.setAttribute(`id`, `htmlContainer`);
    node.style.position = `fixed`;
    node.style.opacity = `0`;
    node.style.pointerEvents = `none`;
    document.body.appendChild(node);
    return node;
  }, []);

  const sceneSize = React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians
    const height = 2 * Math.tan(fov / 2) * 5; // visible height
    const width = height * (viewSize.width / viewSize.height);
    return { width, height };
  }, [camera, viewSize]);

  const lastUrl = React.useRef<undefined | string>(undefined);

  const [image, setImage] = React.useState(
    `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`,
  );
  const [textureSize, setTextureSize] = React.useState({ width, height });

  const node = React.useMemo(() => {
    logger.log(`HtmlObject: children changed`, {});

    const node = document.createElement(`div`);
    node.innerHTML = renderToString(children);
    return node;
  }, [children]);

  React.useEffect(() => {
    logger.log(`HtmlObject: node changed`, {});

    container.appendChild(node);

    logger.log(`HtmlObject: Call html2canvas`, {});
    // eslint-disable-next-line no-void
    void html2canvas(node, { backgroundColor: color }).then((canvas) => {
      logger.log(`HtmlObject:html2canvas then start`, {});

      logger.log(`HtmlObject:html2canvas then setTextureSize`, {});

      setTextureSize({ width: canvas.width, height: canvas.height });
      if (container.contains(node)) {
        container.removeChild(node);
      }

      logger.log(`HtmlObject:html2canvas then canvas.toBlob`, {});
      canvas.toBlob((blob) => {
        if (blob === null) return;
        if (lastUrl.current != null) {
          URL.revokeObjectURL(lastUrl.current);
        }
        const url = URL.createObjectURL(blob);
        lastUrl.current = url;

        logger.log(`HtmlObject:html2canvas then canvas.toBlob setImage`, {});
        setImage(url);
      });
    });
    return () => {
      if (!container) return;
      if (container.contains(node)) {
        container.removeChild(node);
      }
    };
  }, [node, viewSize, sceneSize, color]);

  const texture = useTexture(image);

  const size = React.useMemo(() => {
    const imageAspectW = texture.image.height / texture.image.width;
    const imageAspectH = texture.image.width / texture.image.height;

    const cam = camera as THREE.PerspectiveCamera;
    const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians

    let h = 2 * Math.tan(fov / 2) * 5; // visible height
    let w = h * imageAspectH;

    if (width !== undefined) {
      w = width;
    }
    if (height !== undefined) {
      h = height;
    }

    if (height === undefined) {
      h = width * imageAspectW;
    }
    if (width === undefined) {
      w = h * imageAspectH;
    }
    return {
      width: w,
      height: h,
    };
  }, [texture, width, height, camera]);

  React.useMemo(() => {
    texture.matrixAutoUpdate = false;
    const aspect = size.width / size.height;
    const imageAspect = texture.image.width / texture.image.height;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearFilter;
    if (aspect < imageAspect) {
      texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
    } else {
      texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
    }
  }, [texture, size, textureSize]);

  logger.log(`HtmlObject render`, {});
  return (
    <mesh position={position}>
      <planeBufferGeometry args={[size.width, size.height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
    </mesh>
  );
};

export const ExampleHtmlObject = (props: { position: [number, number, number] }) => {
  return (
    <>
      <HtmlObject width={2} height={2} {...props}>
        <div
          style={{
            fontFamily: `Arial, sans-serif`,
            fontSize: `100px`,
            margin: `1px`,
          }}
        >
          <ol style={{ marginLeft: `1em` }}>
            <li>
              <strong>bold</strong>
            </li>
            <li>
              <em>italics</em>
            </li>
            <li>
              <span style={{ color: `red` }}>red</span>
            </li>
            <li>
              <span style={{ color: `green` }}>green</span>
            </li>
            <li>
              <span style={{ color: `blue` }}>blue</span>
            </li>
          </ol>

          <img src='/assets/test.png' alt='' crossOrigin='anonymous' style={{ border: `0.1em solid red` }} />
        </div>
      </HtmlObject>
    </>
  );
};

// Slow!
export const ExampleHtmlObject_Dynamic = (props: { position: [number, number, number] }) => {
  const [text, setText] = useState(`0`);

  useIsomorphicLayoutEffect(() => {
    const t = setInterval(() => {
      logger.log(`ExampleHtmlObject_Dynamic START`, {});

      setText(`${Date.now()}`);
    }, 10000);

    return () => clearInterval(t);
  }, []);

  return (
    <>
      <HtmlObject width={2} height={2} {...props}>
        <div
          style={{
            fontFamily: `Arial, sans-serif`,
            fontSize: `100px`,
            margin: `1px`,
          }}
        >
          <ol style={{ marginLeft: `1em` }}>
            <li>
              <strong>bold</strong>
            </li>
            <li>
              <em>italics</em>
            </li>
            <li>
              <span style={{ color: `red` }}>red - {text}</span>
            </li>
            <li>
              <span style={{ color: `green` }}>green - {text}</span>
            </li>
            <li>
              <span style={{ color: `blue` }}>blue - {text}</span>
            </li>
          </ol>

          <img src='/assets/test.png' alt='' crossOrigin='anonymous' style={{ border: `0.1em solid red` }} />
        </div>
      </HtmlObject>
    </>
  );
};
