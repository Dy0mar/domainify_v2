import React, {Component} from 'react'
import "antd/dist/antd.css";
import css from './App.module.css'
import { Layout, Breadcrumb } from 'antd'
import {compose} from "redux";
import {connect, Provider} from "react-redux";
import store from "./redux/redux-store";
import {
    BrowserRouter,
    Route,
    Switch,
} from "react-router-dom";
import HeaderContainer from "./components/Header/HeaderContainer";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import {withAuthRedirect} from "./hoc/withAuthRedirect";
const { Content } = Layout;

class App extends Component {

    render () {

        return (
            <Layout className="layout">
                <HeaderContainer />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={css.appWrapperContent}>

                        <Switch>
                            <Route path='/login' render={() => <Login />}/>
                        </Switch>

                    </div>
                </Content>
                <Footer />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    initialized: state.app.initialized,
    isAuth: state.auth.isAuth,
});

let AppContainer = compose(
    connect(mapStateToProps),
    withAuthRedirect,
)(App);


let MainApp = (props) => {
    return (
        <BrowserRouter>
            <Provider store={store} >
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
};

export default MainApp