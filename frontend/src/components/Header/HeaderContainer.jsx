import React from 'react'
import {logout} from "../../redux/auth-reducer";
import Header from "./Header";
import {connect} from "react-redux";

const HeaderContainer = (props) => {
    return (
        <Header {...props} />
    )
};

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
});



export default connect(mapStateToProps, {logout})(HeaderContainer)

