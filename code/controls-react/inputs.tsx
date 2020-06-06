import React, { } from 'react';
import { TextInput } from 'react-native-lite';
import { theme, ThemeTextStyle } from 'themes/theme';

export const Input_Text = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='off'
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Username = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='username'
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Password = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='password'
            secureTextEntry
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export type Currency = number;// & { __type: 'currency' };
export const Input_Currency = (props: { style?: ThemeTextStyle, value: Currency, onChange: (value: Currency) => void, onSubmit?: () => void }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='numeric'
            autoCompleteType='off'
            value={`${props.value}`}
            onChange={(x) => props.onChange(Number.parseFloat(x) || 0)}
            onSubmitEditing={props.onSubmit}
        />
    );
};
