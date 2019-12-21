import React from 'react'
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";


const UsersContainer = (props) => {

    return (
        <div>
            <Divider>Users here</Divider>
            <Row>
                <Col span={24}>
                    row users
                </Col>
            </Row>
        </div>
    )
};

export default compose(
    withAuthRedirect,
)(UsersContainer);
