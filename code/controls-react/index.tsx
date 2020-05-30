import React, { } from 'react';
import { View, Text } from 'react-native-lite';
import { theme } from 'themes/theme';
import { Loading } from './loading';
import { ErrorBox } from './error-box';
import { Input_Currency } from './inputs';
import { Button } from './button';

type PropsOf<T> = T extends (props: infer P) => JSX.Element ? P : never;

export const C = {
    Loading,
    ErrorBox,
    View_Form: (props: PropsOf<typeof View>) => (<View style={theme.view_form} {...props} />),
    View_FieldRow: (props: PropsOf<typeof View>) => (<View style={theme.view_fieldRow} {...props} />),
    Text_FormTitle: (props: PropsOf<typeof Text>) => (<Text style={theme.text_formTitle} {...props} />),
    Text_FieldLabel: (props: PropsOf<typeof Text>) => (<Text style={theme.text_fieldLabel} {...props} />),
    Button_FieldInline: (props: PropsOf<typeof Button>) => (<Button style={theme.button_fieldInline} {...props} />),
    // <button style={theme.button_fieldInline} type='button' onClick={() => makePurchase()}>Purchase</button>
    Input_Currency,
};
