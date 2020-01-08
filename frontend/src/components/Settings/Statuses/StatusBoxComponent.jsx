import React from 'react'
import {
    Button, Col, Row, Typography,
} from 'antd';
import "antd/dist/antd.css";
import {Box} from "../../Common/Box/Box";
import {NavLink} from "react-router-dom";
import {deleteConfirm} from "../../../utils/utils";

const { Text } = Typography;

const StatusBoxComponent = (props) => {
    const {setDefaultStatuses, deleteStatus} = props;
    const {statuses} = props;

    const getNewItem = (item, index) => {
        return <Row key={index}>
            <Col span={4}><Text strong>{item.status}: </Text></Col>
            <Col span={16}><Text>{item.comment}</Text></Col>
            <Col span={4}>
                <NavLink to={`/settings/statuses/${item.pk}`}>Edit</NavLink>
                <Button type="link" icon={'delete'} style={{marginLeft: 10, color:'red'}} onClick={() => deleteConfirm(deleteStatus, item.pk, item.status)}>
                    Delete
                </Button>
            </Col>
        </Row>
    };

    return (
        <Box boxTitleText={'Statuses'} icon={'info-circle'} onClickMethod={null}>
            {!!statuses.length && statuses.map((item, index) => getNewItem(item, index)
            )}

            {!statuses.length && <span>
                            <Row>Statuses is empty. Please click install Statuses for install standard (NEW, IN_PROGRESS, DONE, CANCELED)</Row>
                            <Row><Button type="primary" onClick={setDefaultStatuses}> install Statuses</Button></Row>
                            </span>
            }
        </Box>
    )
};

export default StatusBoxComponent;
