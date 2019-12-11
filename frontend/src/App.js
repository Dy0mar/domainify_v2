import React, {Component} from 'react'
import "antd/dist/antd.css";
import css from './App.module.css'
import { Layout, Breadcrumb } from 'antd'
import {compose} from "redux";
import {connect, Provider} from "react-redux";
import store from "./redux/redux-store";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import Header from "./components/Header/HeaderContainer";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProfileContainer from "./components/Profile/ProfileContainer";
const { Content } = Layout;

class App extends Component {

    render () {

        return (
            <Switch>
                <Route path='/login' render={() => <Login />}/>
                <Route path='/register' render={() => <Register />}/>

                <Layout className="layout">
                    <Header />
                    <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={css.appWrapperContent}>
                                <Route path='/profile' render={() => <ProfileContainer />}/>
                                <Redirect from="/" to="/profile" />
                                <Route path='*' render={() => <div>404 Not Found</div>}/>


                        </div>
                    </Content>
                    <Footer />
                </Layout>
            </Switch>
        )
    }
}

const mapStateToProps = (state) => ({
    initialized: state.app.initialized,
    isAuth: state.auth.isAuth,
});

let AppContainer = compose(
    connect(mapStateToProps),
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