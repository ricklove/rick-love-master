/* eslint-disable react-hooks/exhaustive-deps */
import './achievement.css';
import React from 'react';

export const AchievementViewer = (props: { name: string }) => {


    return (
        <div>
            <div className='achievement' style={{ display: `flex` }}>
                <div style={{ flex: 1 }} />
                <div className='achievement-label' style={{ fontFamily: `monospace`, color: `#CCCC style={{flex:1}}CC`, fontSize: `0.8rem` }} >New Achievement! </div>
                <div className='achievement-name' style={{ fontFamily: `monospace` }} >{props.name}</div>
            </div>
        </div>
    );
};
