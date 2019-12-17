import React from 'react'
import {Row, Col, Form, Input, Button} from 'antd';
import "antd/dist/antd.css";
import css_form from './UserInfoForm.module.css'
import {RowItem} from "../../RowItem/RowItem";

const getUserData = values => ({
    'email': values.email,
    'profile': {
        'jabber_nick': values.jabber_nick
    }
});

const UserInfoForm = (props) => {
    const {
        username, email, jabber_nick, deActivateEditMode, updateUserProfile,
    } = props;
    const {getFieldDecorator, validateFields} = props.form;

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {
                updateUserProfile(getUserData(values));
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
        <Row>
            <Col span={24}>
                <Form onSubmit={onSubmit}>
                    {data.map((row, index) => {
                        return <RowItem
                            label={row[0]}
                            text={row[1]}
                            key={index}
                        />
                    })}

                    <Row>
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
    )
};

const UserInfoFormComponent = Form.create({ name: 'user_info_form', })(UserInfoForm);

export default UserInfoFormComponent;
