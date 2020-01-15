import React from 'react'
import {Row, Col, Button} from 'antd';
import "antd/dist/antd.css";
import {RowItem} from "../RowItem/RowItem";

const checkItem = (value, handleOnclick, method) => (
    <Row>
        <Col span={12}>{value}</Col>
        <Col span={12}>
            <Button onClick={() => handleOnclick(method)} type="dashed">Check</Button>
        </Col>
    </Row>
);

const UserInfo = (props) => {
    const { username, email, jabber_nick, handleOnclick } = props;

    const data = [
        ['Username', username],
        ['Email', checkItem(email, handleOnclick, 'email')],
        ['Jabber nick', checkItem(jabber_nick, handleOnclick, 'jabber')],
    ];

    return (
        <Row>
            <Col span={24}>
                {data.map((row, index) => {
                    return <RowItem
                        label={row[0]}
                        text={row[1]}
                        key={index}
                    />
                })}
            </Col>
        </Row>
    )
};


export default UserInfo;
