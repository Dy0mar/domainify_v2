import React from 'react'
import {Row, Col} from 'antd';
import "antd/dist/antd.css";
import css from '../Profile.module.css'
import RowInfo from "../UserInfoRow/UserInfoRow";

const UserInfo = (props) => {
    const {
        username, email, jabber_nick, gutters, vgutters, label_size, text_size
    } = props;

    const data = [
        ['Username', username],
        ['Email', email],
        ['Jabber nick', jabber_nick],
    ];

    return (
        <section className={css.boxDescription}>
            <Row>
                <Col span={24}>
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
                </Col>
            </Row>
        </section>
    )
};


export default UserInfo;
