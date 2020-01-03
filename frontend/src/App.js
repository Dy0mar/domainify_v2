import React, {Component} from 'react'
import "antd/dist/antd.css";
import css from './App.module.css'
import {Layout, Breadcrumb, Typography} from 'antd'
import {compose} from "redux";
import {connect, Provider} from "react-redux";
import store from "./redux/redux-store";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import {initializeApp} from "./redux/app-reducer";
import {showMessage} from "./hoc/showMessage";
import Preloader from "./components/Common/Preloader/Preloader";
import Header from "./components/Header/HeaderContainer";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Users from "./components/Users/UsersContainer";
import Register from "./components/Register/Register";
import ProfileContainer from "./components/Profile/ProfileContainer";
import DomainsContainer from "./components/Domains/DomainsContainer";
import DomainCreateContainer from "./components/Domain/DomainCreateContainer";
import DomainDetailContainer from "./components/Domain/DomainDetailContainer";
import DomainEditContainer from "./components/Domain/DomainEditContainer";


const { Content } = Layout;
const { Text } = Typography;

class App extends Component {

    componentDidMount() {
        this.props.initializeApp();
    }

    render () {
        if (!this.props.initialized)
            return <Preloader />;

        return (
            <Layout className="layout">
                <Header />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={css.appWrapperContent}>
                        <Switch>
                            <Route path='/login' render={() => <Login />}/>
                            <Route path='/register' render={() => <Register />}/>
                            <Route path='/profile/:userId?' render={() => <ProfileContainer />}/>
                            <Route path='/users' render={() => <Users />}/>
                            <Route path='/domains/create' render={() => <DomainCreateContainer />}/>
                            <Route path='/domains/:domainId/edit' render={() => <DomainEditContainer />}/>
                            <Route path='/domains/:domainId' render={() => <DomainDetailContainer />}/>
                            <Route path='/domains' render={() => <DomainsContainer />}/>
                            <Redirect exact from="/" to="/profile" />
                            <Route path='**' render={() => <div style={{textAlign: 'center'}}><Text strong type="danger" >Page Not Found</Text></div>}/>
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

const AppContainer = compose(
    connect(mapStateToProps, {initializeApp}),
    showMessage,
)(App);


const MainApp = (props) => {
    return (
        <BrowserRouter>
            <Provider store={store} >
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
};

export default MainApp