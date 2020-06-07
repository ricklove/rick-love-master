import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native-lite';
import { theme, ThemeTextStyle } from 'themes/theme';
import { Icon } from './icon';
import { IconKind } from './icon-kind';

export const Input_Text = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='off'
            placeholder={props.placeholder}
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Username = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='username'
            placeholder={props.placeholder}
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Password = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string }) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={{ flexDirection: `row`, alignItems: `center` }}>
            <TextInput style={props.style ?? theme.input_fieldEntry}
                keyboardType='default'
                autoCompleteType='password'
                secureTextEntry={!showPassword}
                placeholder={props.placeholder}
                value={`${props.value}`}
                onChange={(x) => props.onChange(x)}
                onSubmitEditing={props.onSubmit}
            />
            <TouchableOpacity onPress={() => setShowPassword(s => !s)}>
                <View style={{ paddingLeft: 4, paddingRight: 4 }}>
                    <Icon style={theme.icon} kind={showPassword ? IconKind.eye : IconKind.eyeSlash} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export type Currency = number;// & { __type: 'currency' };
export const Input_Currency = (props: { style?: ThemeTextStyle, value: Currency, onChange: (value: Currency) => void, onSubmit?: () => void, placeholder?: string }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='numeric'
            autoCompleteType='off'
            placeholder={props.placeholder}
            value={`${props.value}`}
            onChange={(x) => props.onChange(Number.parseFloat(x) || 0)}
            onSubmitEditing={props.onSubmit}
        />
    );
};
