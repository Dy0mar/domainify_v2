import React from 'react'
import {Row, Col, Form, Input, Button} from 'antd';
import "antd/dist/antd.css";
import css from '../../Profile.module.css'
import css_form from './UserInfoForm.module.css'
import RowInfo from "../UserInfoRow/UserInfoRow";

const UserInfoForm = (props) => {
    const {
        username, email, jabber_nick, deActivateEditMode, gutters, vgutters,
        updateUserProfile, label_size, text_size
    } = props;
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

    const text_email = <Form.Item className={css_form.formItem}>
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
    </Form.Item>;

    const text_jabber_nick = <Form.Item className={css_form.formItem}>
        {getFieldDecorator('jabber_nick', {
            rules: [{ required: true, message: 'Please input your jabber nick!' }],
            initialValue: jabber_nick
        })(<Input />)}
    </Form.Item>;

    const data = [
        ['Username', username],
        ['Email', text_email],
        ['Jabber nick', text_jabber_nick],
    ];
    return (
        <section className={css.boxDescription}>
            <Row>
                <Col span={24}>
                    <Form onSubmit={onSubmit}>
                        {data.map((row, index) => {
                            return <RowInfo
                                gutters={gutters}
                                vgutters={vgutters}
                                label_size={label_size}
                                text_size={text_size}
                                label={row[0]}
                                text={row[1]}
                                key={index}
                            />
                        })}

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
    )
};

const UserInfoFormComponent = Form.create({ name: 'login_form',  })(UserInfoForm);

export default UserInfoFormComponent;
