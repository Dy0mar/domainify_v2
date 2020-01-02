import React from 'react'
import {Button, Col, Row, Typography} from 'antd';
import "antd/dist/antd.css";
import {Box} from "../../Common/Box/Box";
import {NavLink} from "react-router-dom";

const { Title, Text} = Typography;


const DomainInfoContainer = (props) => {
    const {domain, editLink, deleteConfirm} = props;


    return (
        <>
            <Row>
                <Col span={12}>
                    <Box boxTitleText={'Domain'} icon={'info-circle'} onClickMethod={null}>
                        <Title level={3} copyable>{domain.name}</Title>
                        <Row><Text strong>Manager:</Text> {domain.manager ? domain.manager.username : '-'}</Row>
                        <Row><Text strong>Status:</Text> {domain.status}</Row>
                        <Row><Text strong>Register date:</Text> {domain.register_date}</Row>
                        <Row><Text strong>Expire date:</Text> {domain.expire_date}</Row>
                    </Box>
                </Col>
                <Col span={12}>
                    <Box boxTitleText={'Company'} icon={'info-circle'} onClickMethod={null}>
                        <Row><Text strong>Company:</Text> {domain.company ? domain.company.name: '--'}</Row>
                        <Row><Text strong>Company address:</Text> {domain.company ? domain.company.address: '--'}</Row>
                        <Row>&nbsp;</Row>
                        <Row><Text>Custom company address - используется, если надо прописать адрес, отличный от Company address</Text></Row>
                        <Row><Text strong>Use custom address:</Text> {domain.use_custom_address ? 'yes': 'no'}</Row>
                        <Row><Text strong>Custom company address:</Text> {domain.custom_company_address? domain.custom_company_address: ''}</Row>
                    </Box>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Box boxTitleText={'Contacts'} icon={'phone'} onClickMethod={null}>
                        <Row><Text strong>Emails:</Text> {domain.emails}</Row>
                        <Row><Text strong>Telephones:</Text> {domain.telephones}</Row>
                    </Box>
                </Col>
                <Col span={12}>
                    <Box boxTitleText={'Alexa traffic'} icon={'stock'} onClickMethod={null}>
                        <Row><Text strong>Alexa status:</Text> {domain.alexa_status}</Row>
                        <Row><Text strong>Alexa comment:</Text> {domain.alexa_comment}</Row>
                    </Box>
                </Col>
            </Row>
            <Row>
                <NavLink to={editLink}>
                    <Button type="primary" icon={'edit'}> Edit </Button>
                </NavLink>

                <Button type="danger" icon={'delete'} style={{marginLeft: 10}} onClick={deleteConfirm}>
                    Delete
                </Button>
            </Row>
        </>
    )
};

export default DomainInfoContainer;