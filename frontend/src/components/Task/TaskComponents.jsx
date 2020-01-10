import React from 'react'
import "antd/dist/antd.css";
import {Avatar, Button, Col, Row} from "antd";


export const TaskItemsType = (props) => {
    const {codes, handleClick} = props;
    return (
        <Row>
            {codes.map((item, index) => {
                return (
                    <Col key={index} span={3}>
                        <TaskBlock item={item} handleClick={handleClick} />
                    </Col>
                )
            })}
        </Row>
    )
};


const TaskBlock = (props) => {
    const {item, handleClick} = props;
    return (
        <Row style={{textAlign: 'center', }}>
            <Button style={{backgroundColor: '#e6f7ff', color: 'dimgrey', height: 'auto'}} onClick={() => handleClick(item.pk)} >
                <Avatar shape="square" style={{backgroundColor: '#e6f7ff', color: 'dimgrey'}} size={128} icon="file-protect" />
            </Button>
            <br />
            {item.name}
        </Row>
    )
};