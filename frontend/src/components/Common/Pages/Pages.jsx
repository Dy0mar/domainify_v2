import React from 'react'
import {Typography} from "antd";
import {connect} from "react-redux";

const { Text } = Typography;


export const Page404 = (props) => {
    return (
        <div style={{textAlign: 'center'}}>
            <Text strong type="danger" >Page Not Found</Text>
        </div>
    )
};

export const Page500 = (props) => {
    return (
        <div style={{textAlign: 'center'}}>
            <Text strong type="danger">Something went wrong</Text>
        </div>
    )
};

export const Page503 = (props) => {
    return (
        <div style={{textAlign: 'center'}}>
            <Text strong type="danger" >Service Temporarily Unavailable</Text>
            <div>
                <Text>It means the server fell</Text>
            </div>
            <div>
                <div>{JSON.stringify(props.errorInfo)}</div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    errorInfo: state.app.errorInfo
});

export const Page503Component = connect(mapStateToProps, {})(Page503);
