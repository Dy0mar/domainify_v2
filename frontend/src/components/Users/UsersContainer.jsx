import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getUserListS} from "../../redux/users-selectors";
import {getUserList} from "../../redux/user-reducer";


const UsersContainer = (props) => {
    const [page, setPage] = useState(1);

    useEffect(() => {
        props.getUserList()
    }, [page]);


    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: text => <a>{text}</a>,
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
    ];

    return (
        <div>
            <Divider>Users here</Divider>
            <Row>
                <Col span={24}>
                    {props.users && <Table rowKey={u => u.pk} dataSource={props.users} columns={columns} />}
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    user: state.user,
    users: getUserListS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getUserList})
)(UsersContainer);
