import React from 'react'
import {Divider} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";


const DomainCreator = (props) => {

    return (
        <div>
            <Divider>Domain create</Divider>

        </div>
    )
};

const mapStateToProps = (state) => ({

});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps)
)(DomainCreator);
