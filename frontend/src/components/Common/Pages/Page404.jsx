import React from 'react'
import {Typography} from "antd";
const { Text } = Typography;


export const Page404 = (props) => {
    return (
        <div style={{textAlign: 'center'}}>
            <Text strong type="danger" >Page Not Found</Text>
        </div>
    )
};
