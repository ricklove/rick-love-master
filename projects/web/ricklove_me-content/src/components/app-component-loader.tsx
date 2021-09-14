import React, { useEffect } from 'react';
import { useLoadable } from '@ricklove/utils-react';
import { AppConfig, appConfig } from '../app-config';

/** Load components using async and config */
export const AppComponentLoader = ({
  component,
}: {
  component: { name: string; load: () => Promise<(props: { config: AppConfig }) => JSX.Element> };
}) => {
  const { LoadedComponent, load } = useLoadable(component?.load ?? (async () => EmptyComponent));
  useEffect(() => {
    (async () => await load())();
  }, [load]);
  return <>{LoadedComponent && <LoadedComponent config={appConfig} />}</>;
};

export const EmptyComponent = (_props: {}) => {
  return <></>;
};
