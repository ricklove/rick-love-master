import React, { useState, useEffect } from 'react';
import { ActivitySpinner, View } from 'react-native-lite';
import { theme } from 'themes/theme';

export const Loading = ({ loading }: { loading?: boolean }) => {

    const visible = loading;

    // // Show loading for a min time
    // const [visible, setVisible] = useState(loading);
    // const MIN_TIME_MS = 500;
    // useEffect(() => {
    //     if (loading) { setVisible(true); return () => { }; }
    //     const timeoutId = setTimeout(() => {
    //         setVisible(false);
    //     }, MIN_TIME_MS);
    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [loading]);

    if (!visible) { return <></>; }

    return (
        <View>
            <ActivitySpinner size='large' color={theme.colors.loader} />
        </View>
    );
};

export const LoadingInline = ({ loading }: { loading?: boolean }) => {

    const visible = loading;

    // // Show loading for a min time
    // const [visible, setVisible] = useState(loading);
    // const MIN_TIME_MS = 500;
    // useEffect(() => {
    //     if (loading) { setVisible(true); return () => { }; }
    //     const timeoutId = setTimeout(() => {
    //         setVisible(false);
    //     }, MIN_TIME_MS);
    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [loading]);

    if (!visible) { return <></>; }

    return (
        <>
            <ActivitySpinner size='small' color={theme.colors.loader} />
        </>
    );
};
