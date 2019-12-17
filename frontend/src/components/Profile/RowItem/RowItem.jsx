import React from 'react'
import {Row, Col, Typography} from 'antd';
import "antd/dist/antd.css";

const {Text} = Typography;

export const RowItem = (props) => {
    const { text, label } = props;

    const gutters = props.gutters ? props.gutters : 16;
    const vgutters = props.vgutters ? props.vgutters : 16;
    const label_size = props.label_size ? props.label_size : 4;
    const text_size = props.gutters ? props.text_size : 20;

    return (
        <Row gutter={[gutters, vgutters]} align={'middle'}>
            <Col span={label_size}><Text strong>{label}:</Text></Col>
            <Col span={text_size}>{text}</Col>
        </Row>
    )
};