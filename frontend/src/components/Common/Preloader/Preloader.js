import React from 'react'
import Header from "../../../App";
import {Breadcrumb, Layout} from "antd";
import css from "../../../App.module.css";
import Footer from "../../Footer/Footer";
const { Content } = Layout;

let Preloader = (props) => {
    return (
        <Layout className="layout">
            <Header />
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className={css.appWrapperContent}>
                    wait please...
                </div>
            </Content>
            <Footer />
        </Layout>
    )
};

export default Preloader