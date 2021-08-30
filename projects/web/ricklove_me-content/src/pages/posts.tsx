import React from 'react';

export type PageProps = {
  value: string;
};
export const Page = (props: PageProps) => {
  return (
    <>
      <div style={{ whiteSpace: `pre` }}>{props.value}</div>
      <div>Looks like the Page changes</div>
      <div>{`But the static props doesn't get updated?`}</div>
    </>
  );
};
