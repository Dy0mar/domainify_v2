import React, {useState, useEffect} from 'react'
import {Layout, Menu, Button} from 'antd'
import css from './Header.module.css'
import {NavLink} from "react-router-dom";
const {Item} = Menu;

const { SubMenu } = Menu;

const Header = (props) => {
    const disabled = !props.isAuth;
    const [currentItem, setCurrentItem] = useState('');
    const setMenu = (path) => {
        switch (path) {
            case '/domains': return 'domain_list';
            case '/profile': return 'profile';
            case '/tasks/create': return 'task_create';
            case '/tasks': return 'task_list';
            case '/users': return 'user_list';
            case '/companies': return 'company_list';
            case '/settings': return 'settings';

            default: return ''
        }
    };
    useEffect(() => {
        setCurrentItem(setMenu(props.location.pathname));
    }, [props.location.pathname]);


    return (
        <Layout.Header>
            <div className={css.logo}>
                <div className={css.text}>Domainify</div>
            </div>
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }} selectedKeys={currentItem} selectable={false} >
                <Item disabled={disabled} key="domain_list"><NavLink to='/domains'>Domains</NavLink></Item>
                <Item disabled={disabled} key="company_list"><NavLink to='/companies'>Companies</NavLink></Item>
                <Item disabled={disabled} key="user_list"><NavLink to='/users'>Users</NavLink></Item>
                <SubMenu title={<span className="submenu-title-wrapper">Tasks</span>}>
                    <Item disabled={disabled} key="task_list"><NavLink to='/tasks'>My tasks</NavLink></Item>
                    <Item disabled={disabled} key="task_create"><NavLink to='/tasks/create'>Create new tasks</NavLink></Item>
                </SubMenu>
                <Item disabled={disabled} key="settings"><NavLink to='/settings'>Settings</NavLink></Item>

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