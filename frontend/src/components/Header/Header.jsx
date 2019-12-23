import React, {useState} from 'react'
import {Layout, Menu, Button} from 'antd'
import css from './Header.module.css'
import {NavLink} from "react-router-dom";
const {Item} = Menu;


const Header = (props) => {
    const disabled = !props.isAuth;
    let [currentItem, setCurrentItem] = useState('');

    const handleClick = e => {
        if (e.key !== 'login_logout')
            setCurrentItem(e.key)
    };

    return (
        <Layout.Header>
            <div className={css.logo}>
                <div className={css.text}>Domainify</div>
            </div>
            <Menu onClick={handleClick} theme="dark" mode="horizontal" style={{ lineHeight: '64px' }} selectedKeys={currentItem} selectable={false} >
                <Item disabled={disabled} key="domain_list"><NavLink to='/domains'>Domain list</NavLink></Item>
                <Item disabled={disabled} key="tasks">Tasks</Item>
                <Item disabled={disabled} key="user_list"><NavLink to='/users'>Users</NavLink></Item>

                <Item key="login_logout" style={{float: 'right'}} >
                    {props.isAuth
                        ? <Button onClick={props.logout} type="link">Logout</Button>
                        : <NavLink to="/login" activeClassName='active'>Login</NavLink>
                    }
                </Item>
                 <Item disabled={disabled} key="profile" style={{float: 'right'}}>
                    <NavLink to='/profile'> {props.username}</NavLink>
                </Item>
            </Menu>
        </Layout.Header>
    )
};

export default Header