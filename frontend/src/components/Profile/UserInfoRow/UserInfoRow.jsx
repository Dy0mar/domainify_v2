import React from 'react'
import {Row, Col, Typography} from 'antd';
import "antd/dist/antd.css";

const {Paragraph, Text} = Typography;

export const RowInfo = (props) => {
    const {
        text, label, label_size, text_size, gutters, vgutters
    } = props;

    return (
        <Row gutter={[gutters, vgutters]} align={'middle'}>
            <Col span={label_size}><Text strong>{label}:</Text></Col>
            <Col span={text_size}><Paragraph>{text}</Paragraph></Col>
        </Row>
    )
};

export default RowInfo;