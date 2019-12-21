import React from 'react'
import {logout} from "../../redux/auth-reducer";
import Header from "./Header";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter} from "react-router-dom";

const HeaderContainer = (props) => {
    return (
        <Header {...props} />
    )
};

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    username: state.user.username,
});



export default compose(
    withRouter,
    connect(mapStateToProps, {logout})
)(HeaderContainer)


