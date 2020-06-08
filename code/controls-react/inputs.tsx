import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native-lite';
import { theme, ThemeTextStyle } from 'themes/theme';
import { PhoneNumber, toStandardPhoneNumber, formatPhoneNumber_UsaCanada } from 'utils/phone-number';
import { Icon } from './icon';
import { IconKind } from './icon-kind';

export const Input_Text = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string, editable?: boolean }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='off'
            placeholder={props.placeholder}
            editable={props.editable}
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Username = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string, editable?: boolean }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='default'
            autoCompleteType='username'
            placeholder={props.placeholder}
            editable={props.editable}
            value={`${props.value}`}
            onChange={(x) => props.onChange(x)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export const Input_Password = (props: { style?: ThemeTextStyle, value: string, onChange: (value: string) => void, onSubmit?: () => void, placeholder?: string, editable?: boolean }) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={{ flexDirection: `row`, alignItems: `center` }}>
            <TextInput style={props.style ?? theme.input_fieldEntry}
                keyboardType='default'
                autoCompleteType='password'
                secureTextEntry={!showPassword}
                placeholder={props.placeholder}
                editable={props.editable}
                value={`${props.value}`}
                onChange={(x) => props.onChange(x)}
                onSubmitEditing={props.onSubmit}
            />
            <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={{ outlineColor: theme.icon.outlineColor }}>
                <View style={{ paddingLeft: 4, paddingRight: 4 }}>
                    <Icon style={theme.icon} kind={showPassword ? IconKind.eye : IconKind.eyeSlash} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export type Currency = number;// & { __type: 'currency' };
export const Input_Currency = (props: { style?: ThemeTextStyle, value: Currency, onChange: (value: Currency) => void, onSubmit?: () => void, placeholder?: string, editable?: boolean }) => {
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='numeric'
            autoCompleteType='off'
            placeholder={props.placeholder}
            editable={props.editable}
            value={`${props.value}`}
            onChange={(x) => props.onChange(Number.parseFloat(x) || 0)}
            onSubmitEditing={props.onSubmit}
        />
    );
};

export type Phone = PhoneNumber;
export const Input_Phone = (props: { style?: ThemeTextStyle, value: Phone, onChange: (value: Phone) => void, onSubmit?: () => void, placeholder?: string, editable?: boolean }) => {

    const [valueActual, setValueActual] = useState(formatPhoneNumber_UsaCanada(props.value));
    const changeValueActual = (v: string) => {
        setValueActual(formatPhoneNumber_UsaCanada(v));
        props.onChange(toStandardPhoneNumber(v));
    };
    return (
        <TextInput style={props.style ?? theme.input_fieldEntry}
            keyboardType='phone-pad'
            autoCompleteType='tel'
            placeholder={props.placeholder}
            editable={props.editable}
            value={valueActual}
            onChange={changeValueActual}
            onSubmitEditing={props.onSubmit}
        />
    );
};
