import React from 'react'
import {Layout, Menu, Avatar, Button} from 'antd'
import css from './Header.module.css'
import {NavLink} from "react-router-dom";

const Header = (props) => {
    return (
        <Layout.Header>
            <div className={css.logo}>
                <div className={css.text}>Domainify</div>
            </div>
            <div className={css.user}>
                <Avatar className={css.avatar} icon="user" />
                <NavLink to='/profile'> {props.username}</NavLink>
                {props.isAuth
                    ? <Button onClick={props.logout} type="link">Logout</Button>
                    : <NavLink to="/login" activeClassName='active'>Login</NavLink>
                }
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