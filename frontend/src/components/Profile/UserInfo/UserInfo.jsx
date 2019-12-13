import React from 'react'
import {Row, Col, Typography} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'

const {Paragraph, Text} = Typography;

const UserInfo = ({username, email, onChangeUsername, onChangeEmail}) => {
    return (
        <section className={css.box}>
            <section className={css.boxContainer}>
                <section className={css.boxTitle}>
                    User info
                </section>
                <section className={css.boxDescription}>
                    <Row>
                        <Col span={24}>
                            <div >
                                <Row>
                                    <Col span={6}><div><Text strong>Username:</Text></div></Col>
                                    <Col span={18}><Paragraph editable={{ onChange: onChangeUsername }}>{username}</Paragraph></Col>
                                </Row>
                                <Row>
                                    <Col span={6}><div><Text strong>Email:</Text></div></Col>
                                    <Col span={18}><Paragraph editable={{ onChange: onChangeEmail }}>{email}</Paragraph></Col>
                                </Row>
                                <Row>
                                    <Col span={6}><div><Text strong>Pidgin:</Text></div></Col>
                                    Pidgin
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
