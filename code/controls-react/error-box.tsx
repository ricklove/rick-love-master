import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, Clipboard } from 'react-native-lite';
import { theme } from 'themes/theme';
import { ErrorState } from 'utils/error';
import { jsonStringify_safe } from 'utils/json';

const DEBUG = true;

const Icon = (props: { kind: IconKind, style: ViewStyle }) => {
    return (<></>);
};
enum IconKind {
    Collapsed,
    Expanded,
    Error,
    Retry,
    Copy,
};

const errorBoxStyle = {
    view: theme.div_error,
    text: theme.span_error,
    icon: theme.span_error,
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
                <TouchableOpacity style={{ flex: 1, flexDirection: `row`, alignItems: `center` }} onPress={() => setExpanded(!expanded)}>
                    {canExpand && (expanded ? <Icon style={errorBoxStyle.icon} kind={IconKind.Expanded} /> : <Icon style={errorBoxStyle.icon} kind={IconKind.Collapsed} />)}
                    <View style={{ paddingRight: 8 }}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.Error} />
                    </View>
                    <Text style={[errorBoxStyle.text, { flex: 1, overflow: `hidden` }]} numberOfLines={!expanded ? 1 : undefined}>{errorMessage}</Text>
                </TouchableOpacity>
                {DEBUG && (
                    <TouchableOpacity onPress={() => Clipboard.setString(jsonStringify_safe({ errorMessage, errorDetails, errorObjText }, true))}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.Copy} />
                    </TouchableOpacity>
                )}
                {props.error.retryCallback && (
                    <TouchableOpacity onPress={props.error.retryCallback}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.Retry} />
                    </TouchableOpacity>
                )}
            </View>
            {canExpand && expanded && !!errorDetails && (<Text style={errorBoxStyle.text}>{errorDetails}</Text>)}
            {canExpand && expanded && !!errorObjText && (<Text style={errorBoxStyle.text}>{errorObjText}</Text>)}
        </View>
    );
};
