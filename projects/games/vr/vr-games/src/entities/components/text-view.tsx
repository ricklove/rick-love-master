import React, { useRef, useState } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntityTextView = EntityBase & {
  transform: {
    position: Vector3;
  };
  textView: {
    text: string;
    fontSize: number;
    color: number;
    offset: Vector3;
    // instead of putting in view which erases other view
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityTextView = defineComponent<EntityTextView>().with(
  `textView`,
  ({
    offset,
    defaultText = ``,
    fontSize = 0.05,
    color = 0xffffff,
  }: {
    offset: Vector3;
    defaultText?: string;
    fontSize?: number;
    color?: number;
  }) => {
    return {
      offset,
      text: defaultText,
      fontSize,
      color,

      Component: (x) => <EntityTextViewComponent entity={x.entity as EntityTextView} />,
    };
  },
);

export const EntityTextViewComponent = ({ entity }: { entity: EntityTextView }) => {
  const ref = useRef<Group>(null);
  const createdRef = useRef(false);
  const [text, setText] = useState(``);
  const [fontSize, setFontSize] = useState(0.05);
  const [color, setColor] = useState(0xffffff);

  useIsomorphicLayoutEffect(() => {
    entity.ready.next(true);
  }, []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    if (!createdRef.current && !entity.textView.text) {
      return;
    }
    createdRef.current = true;
    ref.current.position.copy(entity.transform.position).add(entity.textView.offset);

    // rely on state change re-render deduping
    setText(entity.textView.text);
    setColor(entity.textView.color);
    setFontSize(entity.textView.fontSize);
  });

  return (
    <>
      <group ref={ref}>
        {createdRef.current && (
          <Billboard>
            <Text color={color} fontSize={fontSize}>
              {text}
            </Text>
          </Billboard>
        )}
      </group>
    </>
  );
};
