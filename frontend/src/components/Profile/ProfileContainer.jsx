import React, {useEffect, useState} from 'react'
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {Divider, Row, Col, Typography} from 'antd';
import "antd/dist/antd.css";
import UserInfo from "./UserInfo/UserInfo";

const {Paragraph, Text} = Typography;

const ProfileContainer = (props) => {

    let [username, setUsername] = useState(props.username);
    let [email, setEmail] = useState(props.email);

    useEffect(() => {
        setUsername(props.username);
        setEmail(props.email)
    }, [props.username, props.email]);

    const onChangeUsername = (value) => {
        setUsername(value)
    };
    const onChangeEmail = (value) => {
        setEmail(value)
    };

    return (
        <div>
            <Divider>Profile here</Divider>
            <Row>
                <Col span={12}>
                    <UserInfo username={username}
                              email={email}
                              onChangeUsername={onChangeUsername}
                              onChangeEmail={onChangeEmail}
                    />
                </Col>
            </Row>

        </div>
    )
};

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    pk: state.user.pk,
    username: state.user.username,
    email: state.user.email,
    profile: state.user.profile,
    settings: state.user.settings,
});

export default compose(
    connect(mapStateToProps, {}),
    withAuthRedirect
)(ProfileContainer);
