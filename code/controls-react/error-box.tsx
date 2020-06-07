import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Clipboard } from 'react-native-lite';
import { theme } from 'themes/theme';
import { ErrorState } from 'utils/error';
import { jsonStringify_safe } from 'utils/json';
import { Icon } from './icon';
import { IconKind } from './icon-kind';

const DEBUG = true;

const errorBoxStyle = {
    view: theme.view_error,
    text: theme.text_error,
    text_errorMessage: theme.text_errorMessage,
    icon: theme.icon,
    icon_errorMessage: theme.icon_errorMessage,
    button: { outlineColor: theme.colors.outline },
};

export const ErrorBox = ({ error }: { error: ErrorState | null | undefined }) => {
    if (!error) { return (<></>); }
    return (<ErrorBox_Inner error={error} />);
};

const ErrorBox_Inner = (props: { error: ErrorState }) => {
    const [expanded, setExpanded] = useState(false);

    // console.log(`ErrorBox`, { error: props.error, expanded });

    const errorAsString = typeof props.error === `string` ? `${props.error}` : null;
    const errorMessage = props.error.message ?? errorAsString ?? `Unknown Error`;
    const errorDetails = props.error.data && jsonStringify_safe(props.error.data, true) || undefined;
    const errorObjText = DEBUG && props.error && jsonStringify_safe(props.error, true) || undefined;
    const canExpand = !!errorDetails || !!errorObjText;

    return (
        <View style={errorBoxStyle.view}>
            <View style={{ flexDirection: `row` }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: `row`, alignItems: `center`, ...errorBoxStyle.button }} onPress={() => setExpanded(!expanded)}>
                    {canExpand && (expanded ? <Icon style={errorBoxStyle.icon} kind={IconKind.expanded} /> : <Icon style={errorBoxStyle.icon} kind={IconKind.collapsed} />)}
                    <View style={{ paddingRight: 8 }}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.error} />
                    </View>
                    <View style={{ flex: 1, overflow: `hidden` }}>
                        <Text style={errorBoxStyle.text} numberOfLines={!expanded ? 1 : undefined}>{errorMessage}</Text>
                    </View>
                </TouchableOpacity>
                {DEBUG && (
                    <TouchableOpacity style={{ flexDirection: `row`, alignItems: `center`, paddingLeft: 8, ...errorBoxStyle.button }} onPress={() => Clipboard.setString(jsonStringify_safe({ errorMessage, errorDetails, errorObjText }, true))}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.copy} />
                    </TouchableOpacity>
                )}
                {props.error.retryCallback && (
                    <TouchableOpacity style={{ flexDirection: `row`, alignItems: `center`, paddingLeft: 8, ...errorBoxStyle.button }} onPress={props.error.retryCallback}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.retry} />
                    </TouchableOpacity>
                )}
            </View>
            {canExpand && expanded && !!errorDetails && (<Text style={{ ...errorBoxStyle.text }}>{errorDetails}</Text>)}
            {canExpand && expanded && !!errorObjText && (<Text style={{ ...errorBoxStyle.text }}>{errorObjText}</Text>)}
        </View>
    );
};


export const ErrorMessage = (props: { children: string }) => {
    return (
        <View style={{ flexDirection: `row`, alignItems: `center` }}>
            <View style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Icon style={errorBoxStyle.icon_errorMessage} kind={IconKind.error} />
            </View>
            <View style={{ overflow: `hidden` }}>
                <Text style={errorBoxStyle.text_errorMessage} numberOfLines={1}>{props.children}</Text>
            </View>
        </View>
    );
};
