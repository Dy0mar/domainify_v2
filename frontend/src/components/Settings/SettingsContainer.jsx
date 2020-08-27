import React, {useEffect} from 'react'
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {withRouter} from "react-router-dom";
import {
    deleteCode,
    deleteStatus,
    getCodeList,
    getStatusList, setDefaultCodes,
    setDefaultStatuses
} from "../../redux/task-reducer";
import {
    getCodeListS,
    getStatusListS,
    getTaskListS
} from "../../selectors/task-selector";
import {
    CodeBoxItem, CodeDefaultBox,
    StatusBoxItem,
    StatusDefaultBox
} from "./SettingsBoxComponents";
import SettingsBox from "./SettingsBox";


const SettingsContainer = (props) => {
    const {
        codes, statuses,
        getStatusList, setDefaultStatuses, deleteStatus,
        getCodeList, setDefaultCodes, deleteCode,
    } = props;

    useEffect(() => {
        getStatusList();
        getCodeList()
    }, [getStatusList, getCodeList]);

    const getStatusBoxIfEmpty = () => {
        return <StatusDefaultBox setDefault={setDefaultStatuses}/>
    };

    const getNewStatusItem = (item, index) => {
        return <StatusBoxItem key={index} item={item} deleteThunk={deleteStatus}/>
    };

    const getCodeBoxIfEmpty = () => {
        return <CodeDefaultBox setDefault={setDefaultCodes}/>
    };

    const getNewCodeItem = (item, index) => {
        return <CodeBoxItem key={index} item={item} deleteThunk={deleteCode}/>
    };

    const getCreateLink = (link) => `/settings/${link}/create`;

    return (
        <div>
            <Divider>Settings here</Divider>
            <Row>
                <Col span={12}>
                    <SettingsBox objectList={codes}
                                 setDefault={setDefaultCodes}
                                 createLink={getCreateLink('codes')}
                                 boxTitleText={'Codes'}
                                 getNewItem={getNewCodeItem}
                                 getBoxIfEmpty={getCodeBoxIfEmpty}
                    />
                </Col>
                <Col span={12}>
                    <SettingsBox objectList={statuses}
                                 setDefault={setDefaultStatuses}
                                 createLink={getCreateLink('statuses')}
                                 boxTitleText={'Statuses'}
                                 getNewItem={getNewStatusItem}
                                 getBoxIfEmpty={getStatusBoxIfEmpty}
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
    connect(mapStateToProps, {
        getStatusList, getCodeList, setDefaultStatuses, deleteStatus, setDefaultCodes,
        deleteCode
    })
)(SettingsContainer);
