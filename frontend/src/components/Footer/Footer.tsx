import React from 'react'
import { Layout } from 'antd'
import css from './Footer.module.css'

export const Footer: React.FC = (props) => {
    return (
        <div className={css.footer}>
            <Layout.Footer>Domainify_v2 ©2019 Developed by Dy0mar</Layout.Footer>
        </div>
    )
}