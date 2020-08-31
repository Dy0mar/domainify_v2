import React from 'react'
import {logout} from "../../redux/auth-reducer"
import Header from "./Header"
import {connect} from "react-redux"
import {compose} from "redux"
import {withRouter} from "react-router-dom"
import {TAppState} from "../../redux/redux-store"
import {RouteComponentProps} from "react-router"


const HeaderContainer: React.FC<TMapStateProps & TDispatchProps & RouteComponentProps> = (props) => {
    return (
        <Header {...props} />
    )
}

export type TMapStateProps = {
    isAuth: boolean
    username: string
}

export type TDispatchProps = {
    logout: () => void
}

const mapStateToProps = (state: TAppState): TMapStateProps => ({
    isAuth: state.auth.isAuth,
    username: state.user.username,
})



export default compose<React.Component>(
    withRouter,
    connect<TMapStateProps, TDispatchProps, {}, TAppState>(mapStateToProps, {logout})
)(HeaderContainer)
