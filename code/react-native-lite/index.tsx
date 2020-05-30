import React, { ReactNode } from 'react';
import { delay } from 'utils/delay';

export type ViewStyle = {};
export type TextStyle = ViewStyle & {};

function mergeStyles<T>(items: (T | undefined | null) | (T | T[] | undefined | null)[]): T {
    if (Array.isArray(items)) {
        if (items.length === 1) { return mergeStyles(items[0]) ?? {} as T; }
        let item = { ...mergeStyles(items[0]) };
        items.forEach(x => { item = { ...item, ...mergeStyles(x ?? {}) }; });
        return (item ?? {}) as T;
    }
    return items as T;
};

export const View = (props: { style?: ViewStyle | ViewStyle[], children?: ReactNode }) => { return (<div style={mergeStyles(props.style)}>{props.children}</div>); };
export const Text = (props: { style?: TextStyle | TextStyle[], children?: ReactNode, numberOfLines?: undefined | 1 }) => {
    if (props.numberOfLines === 1) {
        const singleLineStyle = {
            overflow: `hidden`,
            wordWrap: `break-word`,
            textOverflow: `ellipsis`,
        } as const;
        return (<span style={mergeStyles([props.style, singleLineStyle])}>{props.children}</span>);
    }
    return (<span style={mergeStyles(props.style)}>{props.children}</span>);
};
export const TouchableOpacity = (props: { style?: ViewStyle | ViewStyle[], children?: ReactNode, onPress: () => void }) => {
    return (
        <div style={mergeStyles(props.style)}
            onClick={props.onPress}
            onTouchEnd={props.onPress}
            onKeyPress={props.onPress}
            role='button'
            tabIndex={0}>
            {props.children}
        </div>
    );
};

export const Clipboard = {
    setString: async (value: string) => { await navigator.clipboard.writeText(value); },
};
