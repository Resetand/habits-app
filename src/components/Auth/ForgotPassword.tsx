import * as antd from 'antd';
import React, { FC, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ifSuccess } from '../../utils/result';
import { UserOutlined } from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';

export const ForgotPasswordRequestForm: FC = () => {
    const api = useApi();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const onFinish = async (usernameOrEmail: string) => {
        setLoading(true);
        await api
            .post('auth/forgot_password', { usernameOrEmail })
            .then(ifSuccess(() => setSuccess(true)));
        setLoading(false);
    };

    if (success) {
        return <antd.Result title="Check your email ;)" status="success" />;
    }
    return (
        <antd.Card loading={loading} title="Forgot password" bordered={false}>
            <antd.Form
                initialValues={{ remember: true }}
                onFinish={(values) => onFinish(values.usernameOrEmail)}
            >
                <antd.Form.Item name="usernameOrEmail" rules={[{ required: true }]}>
                    <antd.Input prefix={<UserOutlined />} placeholder="Username or email" />
                </antd.Form.Item>
                <antd.Form.Item>
                    <antd.Button htmlType="submit" type="primary">
                        Send email
                    </antd.Button>
                </antd.Form.Item>
            </antd.Form>
        </antd.Card>
    );
};

export const RecoveryPasswordForm: FC = () => {
    const { token } = useParams<{ token: string }>();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const api = useApi();
    const onFinish = async (values: { password: string; confirm: string }) => {
        if (values.password !== values.confirm) {
            return alert('Passwords do not match!');
        }

        setLoading(true);
        await api.post('/auth/forgot_password/confirm', { token, password: values.password }).then(
            ifSuccess(() => {
                history.replace('/');
            })
        );
        setLoading(false);
    };

    return (
        <antd.Card loading={loading} title="Password recovery" bordered={false}>
            <antd.Form
                initialValues={{ remember: true }}
                onFinish={(values) => onFinish(values as any)}
            >
                <antd.Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    hasFeedback
                >
                    <antd.Input.Password placeholder="Password" />
                </antd.Form.Item>

                <antd.Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Passwords do not match!');
                            },
                        }),
                    ]}
                >
                    <antd.Input.Password placeholder="Confirm password" />
                </antd.Form.Item>
                <antd.Form.Item>
                    <antd.Button htmlType="submit" type="primary">
                        Confirm
                    </antd.Button>
                </antd.Form.Item>
            </antd.Form>
        </antd.Card>
    );
};
