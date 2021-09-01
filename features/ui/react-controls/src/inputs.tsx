import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { theme, ThemeTextStyle } from '@ricklove/themes';
import { EmailAddress, emailAddress, PhoneNumber, phoneNumber } from '@ricklove/utils-core';
import { Icon } from './icon';
import { IconKind } from './icon-kind';

export const Input_Text = (props: {
  style?: ThemeTextStyle;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  return (
    <TextInput
      style={props.style ?? theme.input_fieldEntry}
      keyboardType='default'
      autoCompleteType='off'
      placeholder={props.placeholder}
      editable={props.editable}
      value={`${props.value}`}
      onChange={(x) => props.onChange(x)}
      onSubmitEditing={props.onSubmit}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    />
  );
};

export const Input_Username = (props: {
  style?: ThemeTextStyle;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
}) => {
  return (
    <TextInput
      style={props.style ?? theme.input_fieldEntry}
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

export const Input_Password = (props: {
  style?: ThemeTextStyle;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  editable?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = props.style ?? theme.input_fieldEntry;
  const { marginRight } = inputStyle;
  return (
    <View style={{ flexDirection: `row`, alignItems: `center` }}>
      <TextInput
        style={{ ...inputStyle, marginRight: 0 }}
        keyboardType='default'
        autoCompleteType='password'
        secureTextEntry={!showPassword}
        placeholder={props.placeholder}
        editable={props.editable}
        value={`${props.value}`}
        onChange={(x) => props.onChange(x)}
        onSubmitEditing={props.onSubmit}
        onBlur={props.onBlur}
      />
      <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={{ outlineColor: theme.icon.outlineColor }}>
        <View style={{ paddingLeft: 4, paddingRight: 4, marginRight }}>
          <Icon style={theme.icon} kind={showPassword ? IconKind.eye : IconKind.eyeSlash} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export type Currency = number; // & { __type: 'currency' };
export const Input_Currency = (props: {
  style?: ThemeTextStyle;
  value: Currency;
  onChange: (value: Currency) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
}) => {
  return (
    <TextInput
      style={props.style ?? theme.input_fieldEntry}
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

export const Input_Phone = (props: {
  style?: ThemeTextStyle;
  value: PhoneNumber;
  onChange: (value: PhoneNumber) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
}) => {
  const [valueActual, setValueActual] = useState(phoneNumber.formatPhoneNumber_UsaCanada(props.value));
  const changeValueActual = (v: string) => {
    setValueActual(phoneNumber.formatPhoneNumber_UsaCanada(v));
    props.onChange(phoneNumber.toStandardPhoneNumber(v));
  };
  return (
    <TextInput
      style={props.style ?? theme.input_fieldEntry}
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

export const Input_Email = (props: {
  style?: ThemeTextStyle;
  value: EmailAddress;
  onChange: (value: EmailAddress) => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
}) => {
  const [valueActual, setValueActual] = useState(emailAddress.toEmailAddress(props.value));
  const changeValueActual = (v: string) => {
    setValueActual(emailAddress.toEmailAddress(v));
    props.onChange(emailAddress.toEmailAddress(v));
  };
  return (
    <TextInput
      style={props.style ?? theme.input_fieldEntry}
      keyboardType='email-address'
      autoCompleteType='email'
      placeholder={props.placeholder}
      editable={props.editable}
      value={valueActual}
      onChange={changeValueActual}
      onSubmitEditing={props.onSubmit}
    />
  );
};
