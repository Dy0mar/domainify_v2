import React from 'react'
import {Icon} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'


export const BoxTitle = (props) => {
    const {boxTitleText, onClick, iconType} = props;
    return (
        <section className={css.boxTitle}>
            {boxTitleText} <Icon onClick={onClick} type={iconType} />
        </section>
    )
};

