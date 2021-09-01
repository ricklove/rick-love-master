import React from 'react';
import { Text, View } from '@ricklove/react-native-lite';
import { theme } from '@ricklove/themes';
import { Button } from './button';
import { ErrorBox, ErrorMessage } from './error-box';
import { Icon } from './icon';
import { Input_Currency, Input_Email, Input_Password, Input_Phone, Input_Text, Input_Username } from './inputs';
import { Loading, LoadingInline } from './loading';

type PropsOf<T> = T extends (props: infer P) => JSX.Element ? P : never;

export { IconKind } from './icon-kind';
export const C = {
  Loading,
  LoadingInline,
  ErrorBox,
  ErrorMessage,
  Icon,
  View_Panel: (props: PropsOf<typeof View>) => <View style={theme.view_panel} {...props} />,
  View_Form: (props: PropsOf<typeof View>) => <View style={theme.view_form} {...props} />,
  View_FormFields: (props: PropsOf<typeof View>) => <View style={theme.view_formFields} {...props} />,
  View_FieldRow: (props: PropsOf<typeof View>) => <View style={theme.view_fieldRow} {...props} />,
  View_FormActionRow: (props: PropsOf<typeof View>) => <View style={theme.view_formActionRow} {...props} />,
  Text_FormTitle: (props: PropsOf<typeof Text>) => <Text style={theme.text_formTitle} {...props} />,
  Text_FieldLabel: (props: PropsOf<typeof Text>) => <Text style={theme.text_fieldLabel} numberOfLines={1} {...props} />,
  Button_FieldInline: (props: PropsOf<typeof Button>) => (
    <Button style={props.styleAlt ? theme.button_fieldInline_alt : theme.button_fieldInline} {...props} />
  ),
  Button_FormAction: (props: PropsOf<typeof Button>) => (
    <Button style={props.styleAlt ? theme.button_formAction_alt : theme.button_formAction} {...props} />
  ),
  Input_Text,
  Input_Username,
  Input_Password,
  Input_Phone,
  Input_Email,
  Input_Currency,
};
