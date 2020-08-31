import React from 'react'
import "antd/dist/antd.css"
import {Icon} from 'antd'
import css from "./Box.module.css"

type TBoxProps = {
    boxTitleText: string
    onClickMethod: () => void
    icon: string
    children: React.ReactNode
}

export const Box: React.FC<TBoxProps> = (props) => {
    const {children, boxTitleText, onClickMethod, icon} = props
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

