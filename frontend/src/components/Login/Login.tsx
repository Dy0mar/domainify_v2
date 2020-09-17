import React, {FormEvent} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {login} from "../../redux/auth-reducer"
import {Alert, Button, Divider, Form, Icon, Input} from 'antd'
import 'antd/dist/antd.css'
import css from './Login.module.css'
import {NavLink, Redirect} from "react-router-dom"
import {FormComponentProps} from "antd/lib/form"
import {getLoginErrorsS, isAuthS} from "../../selectors/auth-selector"


const LoginForm: React.FC<FormComponentProps> = (props) => {

    const {getFieldDecorator, validateFields} = props.form

    const isAuth = useSelector(isAuthS)
    const loginErrors = useSelector(getLoginErrorsS)
    const dispatch = useDispatch()

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        validateFields((err, values) => {
            if (!err) {
                dispatch(login(values.username, values.password))
            }
        })
    }

    return (
        <div className={css.outer}>
            {isAuth && <Redirect to={'/'} />}

            <div className={css.loginForm}>
                <Form onSubmit={onSubmit}>
                    <Divider>Login</Divider>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {loginErrors ? loginErrors.map((msg, index) => <Alert key={index} message={msg} type="error" />) : '' }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={css.submitButton}>
                            Sign in
                        </Button>
                        Or <NavLink to="/register" activeClassName='active'>register now!</NavLink>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export const Login = Form.create({ name: 'login_form',  })(LoginForm)
