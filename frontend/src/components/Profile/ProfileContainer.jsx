import React from 'react'
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import UserInfoContainer from "./UserInfo/UserInfoContainer";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import SettingsContainer from "./Settings/SettingsContainer";


const ProfileContainer = (props) => {

    return (
        <div>
            <Divider>Profile here</Divider>
            <Row>
                <Col span={12}>
                    <UserInfoContainer />
                </Col>

                <Col span={12}>
                    <SettingsContainer />
                </Col>
            </Row>
        </div>
    )
};

export default compose(
    withAuthRedirect,
)(ProfileContainer);
