import React from 'react'
import { Layout, Menu, Avatar } from 'antd'
import './Header.css'
import {NavLink} from "react-router-dom";

const Header = (props) => {
    return (
        <Layout.Header>
            <div className="logo" />
            <div className='user'>
                <Avatar className='avatar' icon="user" />
                <span>userName</span>
                <NavLink to="/login" activeClassName='active'>Login</NavLink>
            </div>

            <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
            >
                <Menu.Item key="1">Domain list</Menu.Item>
                <Menu.Item key="2">Tasks</Menu.Item>
            </Menu>
        </Layout.Header>
    )
};

export default Header