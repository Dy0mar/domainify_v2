import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Typography, Tag} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getUserListPageTotalS, getUserListS} from "../../redux/users-selectors";
import {getUserList} from "../../redux/user-reducer";
import style from './Users.module.css'

const {Text} = Typography;

const UsersContainer = (props) => {
    const {users, total, getUserList} = props;

    const [page, setPage] = useState(1);
    useEffect(() => {
        getUserList(page)
    }, [page, getUserList]);

    const changePage = (page) => {
        setPage(page);
    };

    const [loading, setLoading] = useState(!users.length);
    useEffect(()=>{
        setLoading(!users.length)
    }, [users.length]);

    const [config, setConfig] = useState({});
    useEffect(() => {
        setConfig({
            pagination : {
                total: total,
                pageSize: 10,
                onChange: changePage,
                position: total >= 10 ? 'bottom' : 'none'
            },
            rowClassName: record => record.username === props.user.username ? style.highlightRow: '',
            loading: loading,
            columns: [
                {
                    title: 'Username',
                    dataIndex: 'username',
                    key: 'username',
                    render: text => <Text strong >{text}</Text>
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: 'Jabber',
                    dataIndex: 'profile.jabber_nick',
                    key: 'jabber_nick',
                },
                {
                    title: 'Notification On/Off',
                    key: 'settings',
                    dataIndex: 'settings',
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
    }, [page, loading, users, total, props.user.username]);

    return (
        <div>
            <Divider>Users here</Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} />
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    user: state.user,
    users: getUserListS(state),
    total: getUserListPageTotalS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getUserList})
)(UsersContainer);
