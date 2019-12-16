import React from 'react'
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import css from "./Profile.module.css";
import UserInfoContainer from "./UserInfo/UserInfoContainer";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";


const ProfileContainer = (props) => {

    return (
        <div>
            <Divider>Profile here</Divider>
            <Row>
                <Col span={12}>
                    <UserInfoContainer />
                </Col>

                <Col span={12}>
                    <section className={css.box}>
                        <section className={css.boxContainer}>

                        </section>
                    </section>
                </Col>
            </Row>
        </div>
    )
};

export default compose(
    withAuthRedirect
)(ProfileContainer);
