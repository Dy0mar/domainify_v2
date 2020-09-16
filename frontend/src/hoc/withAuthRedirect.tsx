import React from "react"
import {useSelector} from "react-redux"
import {Redirect} from "react-router-dom"
import {isAuthS} from "../selectors/g-selector"


export function withAuthRedirect<WCP>(WrappedComponent: React.ComponentType<WCP>) {
    const WrapperComponent: React.FC = (props) => {
        const isAuth = useSelector(isAuthS)
        return (
            (isAuth
                 ? <WrappedComponent {...props as WCP}/>
                 : <Redirect to='/login' />
                 )
        )
    }

    return WrapperComponent
}
