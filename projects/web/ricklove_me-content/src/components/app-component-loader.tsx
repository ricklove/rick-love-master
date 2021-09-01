import React, { useEffect } from 'react';
import { useLoadable } from '@ricklove/utils-react';
import { AppApiConfig, appApiConfig } from '../app-config';

/** Load components using async and config */
export const AppComponentLoader = ({
  component,
}: {
  component: { name: string; load: () => Promise<(props: { config: AppApiConfig }) => JSX.Element> };
}) => {
  const { LoadedComponent, load } = useLoadable(component?.load ?? (async () => EmptyComponent));
  useEffect(() => {
    (async () => await load())();
  }, [load]);
  return <div>{LoadedComponent && <LoadedComponent config={appApiConfig} />}</div>;
};

export const EmptyComponent = (_props: {}) => {
  return <></>;
};
