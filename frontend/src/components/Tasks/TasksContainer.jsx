import React from 'react'
import {Divider, Row, Col, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {withRouter} from "react-router-dom";


const TasksContainer = (props) => {

    return (
        <div>
            <Divider>Tasks here</Divider>
            <Row>
                <Col span={24} style={{padding: '0 15px'}}>
                    content
                </Col>
            </Row>
        </div>
    )
};


const mapStateToProps = (state) => ({
    tasks: state.tasks,
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {})
)(TasksContainer);
