import React from 'react';
import { View, Text, TextInput } from 'react-native-lite';
import { theme } from 'themes/theme';
import { Loading } from './loading';
import { ErrorBox } from './error-box';

type PropsOf<T> = T extends (props: infer P) => JSX.Element ? P : never;

export type Currency = number;// & { __type: 'currency' };
export const Input_Currency = (props: { style?: PropsOf<typeof Text>['style'], value: Currency, onChange: (value: Currency) => void }) => {
    return (
        <TextInput style={theme.input_fieldEntry}
            keyboardType='numeric'
            value={`${props.value}`}
            onChange={(x) => props.onChange(Number.parseFloat(x) || 0)}
        />
    );
};

export const C = {
    Loading,
    ErrorBox,
    View_Form: (props: PropsOf<typeof View>) => (<View style={theme.view_form} {...props} />),
    View_FieldRow: (props: PropsOf<typeof View>) => (<View style={theme.view_fieldRow} {...props} />),
    Text_FormTitle: (props: PropsOf<typeof Text>) => (<Text style={theme.text_formTitle} {...props} />),
    Text_FieldLabel: (props: PropsOf<typeof View>) => (<View style={theme.text_fieldLabel} {...props} />),
    Input_Currency,
};
