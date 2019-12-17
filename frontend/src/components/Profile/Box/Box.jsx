import React from 'react'
import "antd/dist/antd.css";
import css from "../Profile.module.css";
import {BoxTitle} from "../BoxTitle/BoxTitle";


export const Box = ({children, boxTitleText, onClickMethod, icon}) => {
        return (
        <section className={css.box}>
            <section className={css.boxContainer}>

                <BoxTitle boxTitleText={boxTitleText}
                          onClick={onClickMethod}
                          iconType={icon}
                />
                <section className={css.boxDescription}>
                    {children}
                </section>
            </section>
        </section>
    )
};

