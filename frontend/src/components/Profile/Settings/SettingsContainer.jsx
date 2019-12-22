import React from 'react'
import "antd/dist/antd.css";
import {Box} from "../Box/Box";
import {connect} from "react-redux";
import {updateUserProfile} from "../../../redux/user-reducer";
import {Row, Col, Switch} from 'antd';
import {RowItem} from "../RowItem/RowItem";


const switchItem = (name, checked, handleChange) => (
    <Switch name={name} size='small' checked={checked} onClick={handleChange} />
);


const SettingsContainer = (props) => {
    const handleChange = (value, e) => {
        e.preventDefault();
        props.updateUserProfile({'settings' : {[e.target.name]: value}})
    };

    const data = [
        ['Jabber', switchItem('jabber', props.settings.jabber, handleChange)],
        ['Email', switchItem('email', props.settings.email, handleChange)],
    ];

    return (
        <Box boxTitleText={'Notification method'} icon={'edit'} onClickMethod={null}>
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
        </Box>
    )
};

const mapStateToProps = (state) => ({
    settings: state.user.settings,
});

export default connect(mapStateToProps, {updateUserProfile})(SettingsContainer)
