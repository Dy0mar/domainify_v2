import React from 'react'
import {Breadcrumb} from "antd";
import {Link, withRouter} from "react-router-dom";
import {compose} from "redux";

const BreadcrumbComponent = (props) => {

    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const extraBreadcrumbItems = pathSnippets.map((item, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{item}</Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    )
};


export default compose(
    withRouter,
)(BreadcrumbComponent);