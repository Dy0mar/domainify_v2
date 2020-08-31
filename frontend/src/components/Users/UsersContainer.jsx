import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Typography, Tag} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"
import {
    getUserListPageTotalS,
    getUserListS,
    getUserPageSizeS
} from "../../selectors/users-selectors"
import {getUserList} from "../../redux/user-reducer"
import style from './Users.module.css'
import {getIsLoadingS} from "../../selectors/app-selector"

const {Text} = Typography

const UsersContainer = (props) => {
    const {user, users, total, getUserList, isLoading, page_size} = props

    useEffect(() => {
        getUserList()
    }, [getUserList])

    const onApplyFilter = (pagination, filters, sorter, extra) => {
        getUserList(pagination.current)
    }

    const [config, setConfig] = useState({})
    useEffect(() => {
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field})

        setConfig({
            pagination : {
                total: total,
                pageSize: page_size,
                position: total >= page_size ? 'bottom' : 'none'
            },
            rowClassName: row => row.username === user.username ? style.highlightRow: '',
            loading: isLoading,
            columns: [
                {
                    ...getColumn('Username', 'username'),
                    render: text => <Text strong >{text}</Text>
                },
                {...getColumn('Email', 'email'),},
                {...getColumn('Jabber', 'profile.jabber_nick'),},
                {
                    ...getColumn('Notification On/Off', 'settings'),
                    render: settings => (
                        <span>
                            {settings && <Tag color={settings.jabber ? 'green' : 'volcano'}>jabber</Tag>}
                            {settings && <Tag color={settings.email ? 'green' : 'volcano'}>email</Tag>}
                        </span>
                    ),
                },
            ],
            dataSource: users,
            rowKey: u => u.pk
        })
    }, [isLoading, users, total, user.username, page_size])

    return (
        <div>
            <Divider>Users here</Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} onChange={onApplyFilter} />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    users: getUserListS(state),
    total: getUserListPageTotalS(state),
    page_size: getUserPageSizeS(state),
    isLoading: getIsLoadingS(state)
})

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getUserList})
)(UsersContainer)
