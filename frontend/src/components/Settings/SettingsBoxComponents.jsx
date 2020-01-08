import React from 'react'
import {
    Button, Col, Row, Typography,
} from 'antd';
import "antd/dist/antd.css";
import {NavLink} from "react-router-dom";
import {deleteConfirm} from "../../utils/utils";

const { Text } = Typography;

export const StatusBoxItem = (props) => {
    const {item, deleteThunk} = props;
    return <Row>
            <Col span={4}><Text strong>{item.status}: </Text></Col>
            <Col span={16}><Text>{item.comment}</Text></Col>
            <Col span={4}>
                <NavLink to={`/settings/statuses/${item.pk}`}>Edit</NavLink>
                <Button type="link" icon={'delete'} style={{marginLeft: 10, color:'red'}} onClick={() => deleteConfirm(deleteThunk, item.pk, item.status)}>
                    Delete
                </Button>
            </Col>
        </Row>
};

export const CodeBoxItem = (props) => {
    const {item, deleteThunk} = props;
    return <Row>
            <Col span={6}><Text strong>{item.name}: </Text></Col>
            <Col span={4}><Text>{item.code}</Text></Col>
            <Col span={10}><Text>{item.comment}</Text></Col>
            <Col span={4}>
                <NavLink to={`/settings/codes/${item.pk}`}>Edit</NavLink>
                <Button type="link" icon={'delete'} style={{marginLeft: 10, color:'red'}} onClick={() => deleteConfirm(deleteThunk, item.pk, item.status)}>
                    Delete
                </Button>
            </Col>
        </Row>
};

export const StatusDefaultBox = (props) => {
    const {setDefault} = props;
    const mapList = ['NEW', 'IN_PROGRESS', 'DONE', 'CANCELED'];
    return <DefaultBox name={'Statuses'} setDefault={setDefault} mapList={mapList}/>
};

export const CodeDefaultBox = (props) => {
    const {setDefault} = props;
    const mapList = ['EDIT_SITE_INFO', 'CHANGE_WHOIS', 'REMIND_ME'];
    return <DefaultBox name={'Codes'} setDefault={setDefault} mapList={mapList}/>
};

const DefaultBox = ({name, setDefault, mapList}) => {
    return <span>
        <Row>{name} is empty. Please click install Statuses for install standard ({mapList.join(', ')})</Row>
        <Row><Button type="primary" onClick={setDefault}> install {name}</Button></Row>
    </span>
};
