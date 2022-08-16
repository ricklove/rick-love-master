import React from 'react';
import { ActivityIndicator, View } from '@ricklove/react-native-lite';
import { theme } from '@ricklove/themes';

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

  if (!visible) {
    return <></>;
  }

  return (
    <View>
      <ActivityIndicator size='large' color={theme.colors.loader} />
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

  if (!visible) {
    return <></>;
  }

  return (
    <>
      <ActivityIndicator size='small' color={theme.colors.loader} />
    </>
  );
};
