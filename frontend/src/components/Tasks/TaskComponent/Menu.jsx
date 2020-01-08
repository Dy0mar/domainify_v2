import React from 'react'
import {Menu, Icon} from 'antd';
import "antd/dist/antd.css";
import {NavLink} from "react-router-dom";

const MenuComponent = (props) => {

    return (
        <Menu defaultSelectedKeys={['tasks']} mode="inline">
            <Menu.Item key="tasks">
                <NavLink to={'/tasks'}><Icon type="pie-chart" />My tasks</NavLink>
            </Menu.Item>
            <Menu.Item  key="settings">
                <NavLink to={'/tasks/settings'}><Icon type="setting" />Settings</NavLink>
            </Menu.Item>
        </Menu>
    )
};



export default MenuComponent
