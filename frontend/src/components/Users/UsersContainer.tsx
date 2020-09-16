import React, {useEffect, useState} from 'react'
import {Col, Divider, Row, Table, Tag, Typography} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {useDispatch, useSelector} from "react-redux"
import {
    getUserListPageTotalS,
    getUserListS,
    getUserPageSizeS
} from "../../selectors/users-selectors"
import {getUserList} from "../../redux/user-reducer"
import style from './Users.module.css'
import {getIsLoadingS} from "../../selectors/app-selector"
import {TAppState} from "../../redux/redux-store"
import {TSettings, TUser} from "../../types/g-types"

const {Text} = Typography

const Users: React.FC = () => {

    const user = useSelector((state:TAppState) => state.user)
    const users = useSelector(getUserListS)
    const total = useSelector(getUserListPageTotalS)
    const page_size = useSelector(getUserPageSizeS)
    const isLoading = useSelector(getIsLoadingS)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserList())
    }, [getUserList])

    const onApplyFilter = (pagination: any, filters: any, sorter: any, extra: any) => {
        getUserList(pagination.current)
    }

    const [config, setConfig] = useState({})
    useEffect(() => {
        const getColumn = (title: string, field: string) => ({title: title, dataIndex: field, key: field})

        setConfig({
            pagination : {
                total: total,
                pageSize: page_size,
                position: total >= page_size ? 'bottom' : 'none'
            },
            rowClassName: (row: TUser) => row.username === user.username ? style.highlightRow: '',
            loading: isLoading,
            columns: [
                {
                    ...getColumn('Username', 'username'),
                    render: (text: string) => <Text strong >{text}</Text>
                },
                {...getColumn('Email', 'email'),},
                {...getColumn('Jabber', 'profile.jabber_nick'),},
                {
                    ...getColumn('Notification On/Off', 'settings'),
                    render: (settings: TSettings) => (
                        <span>
                            {settings && <Tag color={settings.jabber ? 'green' : 'volcano'}>jabber</Tag>}
                            {settings && <Tag color={settings.email ? 'green' : 'volcano'}>email</Tag>}
                        </span>
                    ),
                },
            ],
            dataSource: users,
            rowKey: (row: TUser) => row.pk
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

export default compose(
    withAuthRedirect,
)(Users)
