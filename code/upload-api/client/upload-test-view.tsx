import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { SecureToken } from 'utils/secure-token';
import { uploadApiConfig } from './config';
import { createUploadApiWebClient } from './web-client';
import { UploadUrl } from './types';

export const UploadTestView = (props: {}) => {

    const webClient = useRef(createUploadApiWebClient(uploadApiConfig));

    const [url, setUrl] = useState(null as null | UploadUrl);
    const [urlRenewed, setUrlRenewed] = useState(null as null | UploadUrl);
    const [error, setError] = useState(null as unknown);

    const getUploadUrl = async () => {
        const result = await webClient.current.createUploadUrl({
            contentType: `text`,
        });
        setUrl(result.uploadUrl);
        console.log(`UploadView onPress`, { result });
    };

    const renewUploadUrl = async () => {
        if (!url) { return; }

        const result = await webClient.current.renewUploadUrl({ uploadUrl: url });
        setUrlRenewed(result.uploadUrl);
        console.log(`UploadView onPress`, { result, url });
    };
    const renewUploadUrlInvalidKey = async () => {
        if (!url) { return; }

        try {
            const result = await webClient.current.renewUploadUrl({ uploadUrl: { ...url, secretKey: `FAKE-KEY` as SecureToken } });
            setUrlRenewed(result.uploadUrl);
            console.log(`UploadView onPress`, { result, url });
        } catch (error_) {
            setError(error_);
        }
    };
    return (
        <View>
            <TouchableOpacity onPress={getUploadUrl}>
                <View style={{ background: `#555555`, padding: 4 }}>
                    <Text >Get Upload Url</Text>
                </View>
            </TouchableOpacity>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Read: ${url?.getUrl ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Put : ${url?.putUrl ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Path: ${url?.relativePath ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Time: ${url?.expirationTimestamp ?? ``}`}</Text>

            <TouchableOpacity onPress={renewUploadUrl}>
                <View style={{ background: `#555555`, padding: 4 }}>
                    <Text >Renew Upload Url</Text>
                </View>
            </TouchableOpacity>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Read: ${urlRenewed?.getUrl ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Put : ${urlRenewed?.putUrl ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Path: ${urlRenewed?.relativePath ?? ``}`}</Text>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Time: ${urlRenewed?.expirationTimestamp ?? ``}`}</Text>

            <TouchableOpacity onPress={renewUploadUrlInvalidKey}>
                <View style={{ background: `#555555`, padding: 4 }}>
                    <Text >Renew Upload Url - Invalid Key</Text>
                </View>
            </TouchableOpacity>
            <Text style={{ whiteSpace: `pre-wrap` }}>{`Error: ${JSON.stringify(error, null, 2)}`}</Text>

        </View>
    );
};
