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
    icon: theme.icon,
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
            <View style={{ display: `flex`, flexDirection: `row` as const }}>
                <TouchableOpacity style={{ flex: 1, display: `flex`, flexDirection: `row`, alignItems: `center` }} onPress={() => setExpanded(!expanded)}>
                    {canExpand && (expanded ? <Icon style={errorBoxStyle.icon} kind={IconKind.expanded} /> : <Icon style={errorBoxStyle.icon} kind={IconKind.collapsed} />)}
                    <View style={{ paddingRight: 8 }}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.error} />
                    </View>
                    <View style={{ flex: 1, overflow: `hidden` }}>
                        <Text style={errorBoxStyle.text} numberOfLines={!expanded ? 1 : undefined}>{errorMessage}</Text>
                    </View>
                </TouchableOpacity>
                {DEBUG && (
                    <TouchableOpacity onPress={() => Clipboard.setString(jsonStringify_safe({ errorMessage, errorDetails, errorObjText }, true))}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.copy} />
                    </TouchableOpacity>
                )}
                {props.error.retryCallback && (
                    <TouchableOpacity onPress={props.error.retryCallback}>
                        <Icon style={errorBoxStyle.icon} kind={IconKind.retry} />
                    </TouchableOpacity>
                )}
            </View>
            {canExpand && expanded && !!errorDetails && (<Text style={errorBoxStyle.text}>{errorDetails}</Text>)}
            {canExpand && expanded && !!errorObjText && (<Text style={errorBoxStyle.text}>{errorObjText}</Text>)}
        </View>
    );
};
