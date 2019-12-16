import React from 'react'
import {Row, Col, Typography, Icon} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'

const {Paragraph, Text} = Typography;

const UserInfo = (props) => {
    const {username, email, pidgin, activateEditMode, gutters, vgutters} = props;

    return (
        <section className={css.box}>
            <section className={css.boxContainer}>

                <section className={css.boxTitle}>
                    User info <Icon onClick={activateEditMode} type="edit" />
                </section>

                <section className={css.boxDescription}>
                    <Row>
                        <Col span={24}>
                            <div >
                                <Row gutter={[gutters, vgutters]} align={'middle'}>
                                    <Col span={3}><Text onClick={activateEditMode} strong>Username:</Text></Col>
                                    <Col span={21}><Paragraph>{username}</Paragraph></Col>
                                </Row>
                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={3}><Text strong>Email:</Text></Col>
                                    <Col span={21}><Paragraph>{email}</Paragraph></Col>
                                </Row>
                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={3}><Text strong>Pidgin:</Text></Col>
                                    <Col span={21}><Paragraph>{pidgin}</Paragraph></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </section>

            </section>
        </section>
    )
};


export default UserInfo;
