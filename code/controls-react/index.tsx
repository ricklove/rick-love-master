import React, { } from 'react';
import { View, Text } from 'react-native-lite';
import { theme } from 'themes/theme';
import { Loading, LoadingInline } from './loading';
import { ErrorBox } from './error-box';
import { Input_Text, Input_Username, Input_Password, Input_Currency } from './inputs';
import { Button } from './button';

type PropsOf<T> = T extends (props: infer P) => JSX.Element ? P : never;

export const C = {
    Loading,
    LoadingInline,
    ErrorBox,
    View_Panel: (props: PropsOf<typeof View>) => (<View style={theme.view_panel} {...props} />),
    View_Form: (props: PropsOf<typeof View>) => (<View style={theme.view_form} {...props} />),
    View_FormFields: (props: PropsOf<typeof View>) => (<View style={theme.view_formFields} {...props} />),
    View_FieldRow: (props: PropsOf<typeof View>) => (<View style={theme.view_fieldRow} {...props} />),
    View_FormActionRow: (props: PropsOf<typeof View>) => (<View style={theme.view_formActionRow} {...props} />),
    Text_FormTitle: (props: PropsOf<typeof Text>) => (<Text style={theme.text_formTitle} {...props} />),
    Text_FieldLabel: (props: PropsOf<typeof Text>) => (<Text style={theme.text_fieldLabel} numberOfLines={1} {...props} />),
    Button_FieldInline: (props: PropsOf<typeof Button>) => (<Button style={theme.button_fieldInline} {...props} />),
    Button_FormAction: (props: PropsOf<typeof Button>) => (<Button style={theme.button_formAction} {...props} />),
    Input_Text,
    Input_Username,
    Input_Password,
    Input_Currency,
};
