import './index.css';
import React, { ReactNode, useRef } from 'react';
import { ThemeTextStyle, ThemeViewStyle } from 'themes/theme';

function mergeStyles<T>(items: (T | undefined | null) | (T | T[] | undefined | null)[]): T {
    if (Array.isArray(items)) {
        if (items.length === 1) { return mergeStyles(items[0]) ?? {} as T; }
        let item = { ...mergeStyles(items[0]) };
        items.forEach(x => { item = { ...item, ...mergeStyles(x ?? {}) }; });
        return (item ?? {}) as T;
    }
    return items as T;
};

const viewStyleDefaults = {
    display: `flex`,
    flexDirection: `column`,
} as const;

const textStyleDefaults = {
    whiteSpace: `pre`,
} as const;

const finalizeTextStyle = <T extends unknown>(style: T) => {
    const s = style as {
        userSelect?: 'none';
        MozUserSelect?: 'none';
        WebkitUserSelect?: 'none';
    };
    if (s.userSelect === `none`) {
        s.MozUserSelect = `none`;
        s.WebkitUserSelect = `none`;
    }

    return style;
};

export const View = (props: { style?: ThemeViewStyle | ThemeViewStyle[], children?: ReactNode }) => { return (<div style={mergeStyles([viewStyleDefaults, props.style])}>{props.children}</div>); };
export const Text = (props: { style?: ThemeTextStyle | ThemeTextStyle[], children?: string, numberOfLines?: undefined | 1 }) => {
    if (props.numberOfLines === 1) {
        const singleLineStyle = {
            overflow: `hidden`,
            whiteSpace: `nowrap`,
            wordWrap: `break-word`,
            textOverflow: `ellipsis`,
        } as const;
        const allStyles = mergeStyles([textStyleDefaults, props.style, singleLineStyle]);
        return (<span style={finalizeTextStyle(allStyles)}>{props.children}</span>);
    }
    const allStyles = mergeStyles([textStyleDefaults, props.style]);
    return (<span style={finalizeTextStyle(allStyles)}>{props.children}</span>);
};
export const TextInput = (props: {
    style?: ThemeTextStyle | ThemeTextStyle[];
    keyboardType: 'default' | 'numeric' | 'phone-pad' | 'email-address';
    autoCompleteType: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code';
    secureTextEntry?: boolean;
    placeholder?: string;
    editable?: boolean;
    value: string;
    onChange: (value: string) => void;
    onSubmitEditing?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    multiline?: boolean;
    numberOfLines?: number;
}) => {
    const type = props.keyboardType === `numeric` ? `number`
        : (props.secureTextEntry ? `password`
            : `text`);

    const name = props.autoCompleteType === `username` ? `username`
        : (props.autoCompleteType === `password` ? `password`
            : undefined);

    const onKeyPress = props.onSubmitEditing && ((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === `Enter` && !e.shiftKey) {
            e.preventDefault();
            props.onSubmitEditing?.();
        }
    }) || undefined;

    if (props.multiline) {
        return (<textarea
            name={name} id={name}
            style={mergeStyles([textStyleDefaults, props.style])}
            placeholder={props.placeholder}
            disabled={!(props.editable ?? true)}
            value={props.value}
            onFocus={props.onFocus}
            onChange={(e) => props.onChange(e.target.value)}
            onKeyPress={onKeyPress}
            onBlur={props.onBlur}
            rows={props.numberOfLines}
        />);
    }

    return (<input type={type}
        name={name} id={name}
        style={mergeStyles([textStyleDefaults, props.style])}
        placeholder={props.placeholder}
        disabled={!(props.editable ?? true)}
        value={props.value}
        onFocus={props.onFocus}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyPress={onKeyPress}
        onBlur={props.onBlur}
    />);

};
export const TouchableOpacity = (props: { style?: ThemeViewStyle | ThemeViewStyle[], children?: ReactNode, onPress: () => void }) => {

    // Prevent Initial Press (already pressing when created)
    const lastPressTime = useRef(Date.now());
    const onPress = () => {
        // Prevent duplicate triggers
        if (Date.now() < lastPressTime.current + 250) {
            // console.log(`TouchableOpacity - prevented duplicate trigger`, { lastPressTime: lastPressTime.current, now: Date.now() });
            return;
        }
        lastPressTime.current = Date.now();

        props.onPress();
    };

    const hasTouchStarted = useRef(true);

    return (
        <div style={mergeStyles([viewStyleDefaults, props.style])}
            onClick={onPress}
            onKeyPress={onPress}
            onTouchStart={() => { hasTouchStarted.current = true; }}
            onTouchMove={() => { hasTouchStarted.current = false; }}
            onTouchEnd={() => { if (hasTouchStarted.current) { onPress(); } }}
            role='button'
            tabIndex={0}>
            {props.children}
        </div>
    );
};

export const Pressable = (props: { style?: ThemeViewStyle | ThemeViewStyle[], children?: ReactNode, onPressIn: () => void, onPressOut: () => void }) => {

    const onIgnore = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation?.();
        (e as unknown as { [key: string]: boolean }).cancelBubble = true;
        (e as unknown as { [key: string]: boolean }).returnValue = false;
        return false;
    };

    const onPressIn = (e: React.MouseEvent | React.TouchEvent) => {
        props.onPressIn();
        return onIgnore(e);
    };
    const onPressOut = (e: React.MouseEvent | React.TouchEvent) => {
        props.onPressOut();
        return onIgnore(e);
    };

    return (
        <div style={mergeStyles([viewStyleDefaults, props.style])}
            onMouseDown={onPressIn}
            onMouseUp={onPressOut}
            onTouchStart={onPressIn}
            onTouchEnd={onPressOut}
            onTouchCancel={onPressOut}
            onTouchMove={onIgnore}
            onMouseLeave={onPressOut}
            onTouchEndCapture={onPressOut}
            role='button'
            tabIndex={0}>
            {props.children}
        </div>
    );
};

export const ActivityIndicator = ({ size, color }: { size: 'large' | 'small', color: string }) => {
    const sizePx = size === `small` ? 16 : 32;
    return (
        <CircleSvg size={sizePx} thickness={sizePx / 8} color={color} />
    );
};

// Based on: https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
const CircleSvg = ({ size, thickness, color }: { size: number, thickness: number, color: string }) => {
    const circumference = 2 * Math.PI * (size - thickness) * 0.5;
    const dashLength = circumference * 0.6;
    return (
        <svg style={{ maxWidth: size }} viewBox={`0 0 ${size} ${size}`} xmlns='http://www.w3.org/2000/svg'>
            <circle style={{
                fill: `transparent`,
                stroke: color,
                strokeWidth: thickness,
                opacity: 0.5,
            }} cx={size * 0.5} cy={size * 0.5} r={size * 0.5 - thickness} />
            <circle className='activity-spinner' style={{
                strokeDasharray: dashLength,
                fill: `transparent`,
                stroke: color,
                strokeWidth: thickness,
                transformOrigin: `${size * 0.5}px ${size * 0.5}px`,
            }} cx={size * 0.5} cy={size * 0.5} r={size * 0.5 - thickness} />
        </svg>
    );
};


export const Platform = {
    OS: `web` as 'web' | 'ios' | 'android',
};

export const Clipboard = {
    setString: async (value: string) => { await navigator.clipboard.writeText(value); },
};
