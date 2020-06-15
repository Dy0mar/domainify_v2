import React from 'react'
import "antd/dist/antd.css"
import {Icon} from 'antd'
import css from "./Box.module.css"

export const Box = ({children, boxTitleText, onClickMethod, icon}) => {
    return (
        <section className={css.box}>
            <section className={css.boxContainer}>

                <section className={css.boxTitle}>
                    {boxTitleText} <Icon onClick={onClickMethod} type={icon} />
                </section>

                <section className={css.boxDescription}>
                    {children}
                </section>
            </section>
        </section>
    )
}

