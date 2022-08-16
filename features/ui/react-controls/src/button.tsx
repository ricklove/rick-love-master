import React from 'react';
import { Text, TouchableOpacity } from '@ricklove/react-native-lite';
import { extractTextStyle, extractViewStyle, theme, ThemeTextStyle, ThemeViewStyle } from '@ricklove/themes';

export const Button = (props: {
  style?: ThemeTextStyle & ThemeViewStyle;
  styleAlt?: boolean;
  children: string;
  onPress: () => void;
}) => {
  const s = props.style ?? (props.styleAlt ? theme.button_formAction_alt : theme.button_formAction);
  return (
    <TouchableOpacity style={extractViewStyle(s)} onPress={props.onPress}>
      <Text style={extractTextStyle(s)}>{props.children}</Text>
    </TouchableOpacity>
  );
};
