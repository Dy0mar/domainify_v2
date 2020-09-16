import React from 'react'
import {Breadcrumb} from "antd"
import {Link, useLocation} from "react-router-dom"

export const BreadCrumb: React.FC = React.memo((props) => {

    const location = useLocation()
    const pathSnippets = location.pathname.split('/').filter(i => i)

    const extraBreadcrumbItems = pathSnippets.map((item, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{item}</Link>
            </Breadcrumb.Item>
        )
    })
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems)

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    )
})
