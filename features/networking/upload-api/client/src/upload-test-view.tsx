import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { createUploadApiClient, createUploader, UploadApiConfig, UploadUrl } from '@ricklove/upload-api-common-client';
import { SecureToken } from '@ricklove/utils-core';

export const UploadTestView = (props: { uploadApiConfig: UploadApiConfig }) => {
  const webClient = useRef(createUploadApiClient(props.uploadApiConfig));

  const [url, setUrl] = useState(null as null | UploadUrl);
  const [urlRenewed, setUrlRenewed] = useState(null as null | UploadUrl);
  const [error, setError] = useState(null as unknown);
  const [uploadDownloadData, setUploadDownloadData] = useState(null as null | { upload: unknown; download: unknown });

  const getUploadUrl = async () => {
    const result = await webClient.current.createUploadUrl({
      contentType: `text`,
    });
    setUrl(result.uploadUrl);
    console.log(`UploadView onPress`, { result });
  };
  const getUploadUrl_human = async () => {
    const result = await webClient.current.createUploadUrl({
      contentType: `text`,
      shareablePath: true,
    });
    setUrl(result.uploadUrl);
    console.log(`UploadView onPress`, { result });
  };

  const renewUploadUrl = async () => {
    if (!url) {
      return;
    }

    const result = await webClient.current.renewUploadUrl({ uploadUrl: url });
    setUrlRenewed(result.uploadUrl);
    console.log(`UploadView onPress`, { result, url });
  };
  const renewUploadUrlInvalidKey = async () => {
    if (!url) {
      return;
    }

    try {
      const result = await webClient.current.renewUploadUrl({
        uploadUrl: { ...url, secretKey: `FAKE-KEY` as SecureToken },
      });
      setUrlRenewed(result.uploadUrl);
      console.log(`UploadView onPress`, { result, url });
    } catch (error_) {
      setError(error_);
    }
  };
  const uploadAndDownload = async () => {
    if (!url) {
      return;
    }

    try {
      const data = { timestamp: new Date(), ok: true };
      const uploader = createUploader(url);
      await uploader.uploadData(data);
      const downloaded = await uploader.downloadData();

      setUploadDownloadData({ upload: data, download: downloaded });

      console.log(`UploadView onPress`, { upload: data, download: downloaded });
    } catch (error_) {
      setError(error_);
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={getUploadUrl}>
        <View style={{ background: `#555555`, padding: 4 }}>
          <Text>Get Upload Url</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Read: ${url?.getUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Put : ${url?.putUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Path: ${url?.relativePath ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Time: ${url?.expirationTimestamp ?? ``}`}</Text>
      <TouchableOpacity onPress={getUploadUrl_human}>
        <View style={{ background: `#555555`, padding: 4 }}>
          <Text>Get Upload Url - Human</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Read: ${url?.getUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Put : ${url?.putUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Path: ${url?.relativePath ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Time: ${url?.expirationTimestamp ?? ``}`}</Text>

      <TouchableOpacity onPress={renewUploadUrl}>
        <View style={{ background: `#555555`, padding: 4 }}>
          <Text>Renew Upload Url</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Read: ${urlRenewed?.getUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Put : ${urlRenewed?.putUrl ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Path: ${urlRenewed?.relativePath ?? ``}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Url Time: ${urlRenewed?.expirationTimestamp ?? ``}`}</Text>

      <TouchableOpacity onPress={renewUploadUrlInvalidKey}>
        <View style={{ background: `#555555`, padding: 4 }}>
          <Text>Renew Upload Url - Invalid Key</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Error: ${JSON.stringify(error, null, 2)}`}</Text>

      <TouchableOpacity onPress={uploadAndDownload}>
        <View style={{ background: `#555555`, padding: 4 }}>
          <Text>Upload and Download</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Uploaded : ${JSON.stringify(
        uploadDownloadData?.upload,
        null,
        2,
      )}`}</Text>
      <Text style={{ whiteSpace: `pre-wrap` }}>{`Downloded: ${JSON.stringify(
        uploadDownloadData?.download,
        null,
        2,
      )}`}</Text>
    </View>
  );
};
