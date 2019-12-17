import React from 'react'
import "antd/dist/antd.css";
import {Box} from "../Box/Box";

const SettingsContainer = (props) => {
    const boxTitleText = 'Settings';

    return (
        <Box boxTitleText={boxTitleText} icon={'edit'} onClickMethod={null}>
            <div>
                Component here
            </div>
        </Box>
    )
};

export default SettingsContainer;
