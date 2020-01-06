import React from 'react'
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";


const CompaniesContainer = (props) => {

    return (
        <div>
            <Divider>Companies here</Divider>
            <Row>
                <Col span={24}>
                    table
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {})
)(CompaniesContainer);
