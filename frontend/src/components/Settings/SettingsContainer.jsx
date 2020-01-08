import React, {useEffect} from 'react'
import {Divider, Row, Col, Typography} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {withRouter} from "react-router-dom";
import {
    getCodeList,
    getStatusList,
    setDefaultStatuses
} from "../../redux/task-reducer";
import {
    getCodeListS,
    getStatusListS,
    getTaskListS
} from "../../redux/task-selector";
import {Box} from "../Common/Box/Box";
import StatusBox from "../Statuses/StatusBox";

const { Text } = Typography;


const SettingsContainer = (props) => {
    const {codes, statuses} = props;
    const {getStatusList, getCodeList, setDefaultStatuses} = props;

    useEffect(() => {
        getStatusList();
        getCodeList()
    }, [getStatusList, getCodeList]);

    return (
        <div>
            <Divider>Settings here</Divider>
            <Row>
                <Col span={12}>
                    <Box boxTitleText={'Codes'} icon={'info-circle'} onClickMethod={null}>
                        {codes.length
                            ? codes.map( (item, index) => <Row key={index}><Text strong>{item.code}: </Text> {item.comment}</Row>)
                            : 'setCodes'
                        }
                    </Box>
                </Col>
                <Col span={12}>
                    <StatusBox statuses={statuses}
                               setDefaultStatuses={setDefaultStatuses}
                    />
                </Col>
            </Row>
        </div>
    )
};


const mapStateToProps = (state) => ({
    tasks: getTaskListS(state),
    codes: getCodeListS(state),
    statuses: getStatusListS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getStatusList, getCodeList, setDefaultStatuses})
)(SettingsContainer);
