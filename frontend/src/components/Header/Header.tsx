import React, {useState, useEffect} from 'react'
import {Layout, Menu, Button} from 'antd'
import css from './Header.module.css'
import {NavLink, useLocation} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {isAuthS} from "../../selectors/g-selector"
import {TAppState} from "../../redux/redux-store"
import {logout} from "../../redux/auth-reducer"
const {Item} = Menu

const { SubMenu } = Menu

export const Header: React.FC = React.memo(() => {
    const [currentItem, setCurrentItem] = useState('')

    const isAuth = useSelector(isAuthS)
    const username = useSelector((state: TAppState) => state.user.username)

    const dispatch = useDispatch()
    const location = useLocation()

    const _logout = () => {
        dispatch(logout())
    }

    const disabled = !isAuth

    const setMenu = (path: string) => {
        switch (path) {
            case '/domains': return 'domain_list'
            case '/profile': return 'profile'
            case '/tasks/create': return 'task_create'
            case '/tasks': return 'task_list'
            case '/users': return 'user_list'
            case '/companies': return 'company_list'
            case '/settings': return 'settings'

            default: return ''
        }
    }
    useEffect(() => {
        setCurrentItem(setMenu(location.pathname))
    }, [location.pathname])


    return (
        <Layout.Header>
            <div className={css.logo}>
                <div className={css.text}>Domainify</div>
            </div>
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }} selectedKeys={[currentItem]} selectable={false} >
                <Item disabled={disabled} key="domain_list"><NavLink to='/domains'>Domains</NavLink></Item>
                <Item disabled={disabled} key="company_list"><NavLink to='/companies'>Companies</NavLink></Item>
                <Item disabled={disabled} key="user_list"><NavLink to='/users'>Users</NavLink></Item>
                <SubMenu title={<span className="submenu-title-wrapper">Tasks</span>}>
                    <Item disabled={disabled} key="task_list"><NavLink to='/tasks'>My tasks</NavLink></Item>
                    <Item disabled={disabled} key="task_create"><NavLink to='/tasks/create'>Create new tasks</NavLink></Item>
                </SubMenu>
                <Item disabled={disabled} key="settings"><NavLink to='/settings'>Settings</NavLink></Item>

                <Item key="login_logout" style={{float: 'right'}} >
                    {isAuth
                        ? <Button onClick={_logout} type="link">Logout</Button>
                        : <NavLink to="/login" activeClassName='active'>Login</NavLink>
                    }
                </Item>
                <Item disabled={disabled} key="profile" style={{float: 'right'}}>
                    <NavLink to='/profile'> {username}</NavLink>
                </Item>
            </Menu>
        </Layout.Header>
    )
})