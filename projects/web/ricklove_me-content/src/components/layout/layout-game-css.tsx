// import './layout-game.module.css';
import React, { useEffect } from 'react';

export const LayoutGameCss = (props: {}) => {

    useEffect(() => {
        document.body.style.userSelect = `none`;
        document.body.style.webkitUserSelect = `none`;
    }, []);
    return (<></>);
};
