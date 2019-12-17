import React from 'react'
import {Row, Col} from 'antd';
import "antd/dist/antd.css";
import RowInfo from "./UserInfoRow/UserInfoRow";

const UserInfo = (props) => {
    const { username, email, jabber_nick } = props;

    const data = [
        ['Username', username],
        ['Email', email],
        ['Jabber nick', jabber_nick],
    ];

    return (
        <Row>
            <Col span={24}>
                {data.map((row, index) => {
                    return <RowInfo
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
