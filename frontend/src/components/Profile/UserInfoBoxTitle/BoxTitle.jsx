import React from 'react'
import {Icon} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'


export const BoxTitle = (props) => {
    const {editMode, iconType} = props;
    return (
        <section className={css.boxTitle}>
            User info <Icon onClick={editMode} type={iconType} />
        </section>
    )
};

