import React from 'react'
import "antd/dist/antd.css";
import {Box} from "../Box/Box";
import {connect} from "react-redux";
import {updateUserProfile} from "../../../redux/user-reducer";
import {Row, Col, Checkbox, Typography} from 'antd';
import {RowItem} from "../RowItem/RowItem";

const {Text} = Typography;

const checkBoxItem = (name, checked, handleChange, text) => (
    <Checkbox name={name} checked={checked} onClick={handleChange}>
        {text}
    </Checkbox>
);

const SettingsContainer = (props) => {
    const handleChange = (e) => {
        e.preventDefault();
        props.updateUserProfile({'settings' : {[e.target.name]: e.target.checked}})
    };

    const data = [
        ['Jabber', checkBoxItem('jabber', props.settings.jabber, handleChange)],
        ['Email', checkBoxItem('email', props.settings.email, handleChange)],
    ];

    return (
        <Box boxTitleText={'Settings'} icon={'edit'} onClickMethod={null}>
            <Row>
                <Col span={24}>
                    <Text strong>Notification method:</Text>

                    {data.map((row, index) => {
                        return <RowItem
                            label={row[0]}
                            text={row[1]}
                            key={index}
                        />
                    })}
                </Col>
            </Row>
        </Box>
    )
};

const mapStateToProps = (state) => ({
    settings: state.user.settings,
});

export default connect(mapStateToProps, {updateUserProfile})(SettingsContainer)
