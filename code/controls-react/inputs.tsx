import React, { } from 'react';
import { TextInput } from 'react-native-lite';
import { theme, ThemeTextStyle } from 'themes/theme';

export const Input_Text = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
        />
    );
};

export const Input_Password = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            secureTextEntry
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
        />
    );
};

export type Currency = number;// & { __type: 'currency' };
export const Input_Currency = (props: { style?: ThemeTextStyle, value: Currency, onChange: (value: Currency) => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='numeric'
            value={`${props.value}`}
            onChange={(x) => props.onChange(Number.parseFloat(x) || 0)}
        />
    );
};
