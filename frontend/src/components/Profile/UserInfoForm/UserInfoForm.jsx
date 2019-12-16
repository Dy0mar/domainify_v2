import React from 'react'
import {Row, Col, Typography, Icon, Form, Input, Button} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'
import css_form from './UserInfoForm.module.css'

const {Text, Paragraph} = Typography;

const UserInfoForm = (props) => {
    const {username, email, pidgin, deActivateEditMode, gutters, vgutters, updateUserProfile} = props;
    const {getFieldDecorator, validateFields} = props.form;

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {
                updateUserProfile(values);
                deActivateEditMode()
            }
        });
    };
    return (
        <section className={css.box}>
            <section className={css.boxContainer}>
                <section className={css.boxTitle}>
                    User info <Icon onClick={deActivateEditMode} type="close-circle" />
                </section>
                <section className={css.boxDescription}>
                    <Row>
                        <Col span={24}>
                            <Form onSubmit={onSubmit}>
                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={3}><div><Text strong>Username:</Text></div></Col>
                                    <Col span={21}><Paragraph>{username}</Paragraph></Col>
                                </Row>

                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={3}><div><Text strong>Email:</Text></div></Col>
                                    <Col span={21}>
                                        <Form.Item className={css_form.formItem}>
                                            {getFieldDecorator('email', {
                                                rules: [
                                                    {
                                                        type: 'email',
                                                        message: 'The input is not valid E-mail!',
                                                    },
                                                    {
                                                        required: true,
                                                        message: 'Please input your E-mail!',
                                                    },
                                                ],
                                                initialValue: email
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={3}><div><Text strong>Pidgin:</Text></div></Col>
                                    <Col span={21}>
                                        <Form.Item className={css_form.formItem}>
                                            {getFieldDecorator('pidgin', {
                                                rules: [{ required: true, message: 'Please input your pidgin!' }],
                                                initialValue: pidgin
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={[gutters, vgutters]}>
                                    <Col span={24}>
                                        <Form.Item className={css_form.formItem} style={{textAlign:'center'}}>
                                            <Button className={css_form.buttonForm} type="primary" htmlType="submit">
                                                Save
                                            </Button>
                                            <Button className={css_form.buttonForm} type="default" htmlType="button" onClick={deActivateEditMode}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </section>
            </section>
        </section>
    )
};

const UserInfoFormComponent = Form.create({ name: 'login_form',  })(UserInfoForm);

export default UserInfoFormComponent;
