import React from 'react'
import {Row, Col, Button} from 'antd';
import "antd/dist/antd.css";
import {RowItem} from "../RowItem/RowItem";

const checkItem = (value, handleOnclick) => (
    <Row>
        <Col span={12}>{value}</Col>
        <Col span={12}>
            <Button onClick={handleOnclick} type="dashed">Check</Button>
        </Col>
    </Row>
);

const UserInfo = (props) => {
    const { username, email, jabber_nick } = props;

    const handleOnclick = (e) => {
        alert('todo it')
    };

    const data = [
        ['Username', username],
        ['Email', checkItem(email, handleOnclick)],
        ['Jabber nick', checkItem(jabber_nick, handleOnclick)],
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
