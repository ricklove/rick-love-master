import React, { } from 'react';
import { Text, TouchableOpacity } from 'react-native-lite';
import { theme, ThemeTextStyle, ThemeViewStyle, extractViewStyle, extractTextStyle } from 'themes/theme';

export const Button = (props: { style?: ThemeTextStyle & ThemeViewStyle, children: string, onPress: () => void }) => {
    const s = props.style ?? theme.button_formAction;
    return (
        <TouchableOpacity style={extractViewStyle(s)} onPress={props.onPress}>
            <Text style={extractTextStyle(s)}>{props.children}</Text>
        </TouchableOpacity>
    );
};
