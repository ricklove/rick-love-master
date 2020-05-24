import React from 'react';
// import { HugeComponent } from './huge-component';
// import loadable from '@loadable/component'

export type NotFoundPageData = {};

export const NotFoundPage_Normal = (props: { data: NotFoundPageData }) => (
    <div>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
    </div>
);


// export const NotFoundPage = (props: { data: NotFoundPageData }) => {


//     return (
//         <div>
//             <h1>NOT FOUND</h1>
//             <p>You just hit a route that doesn&#39;t exist... what exactly were you doing anyway?</p>
//             <HugeComponent />
//         </div>
//     );
// };
