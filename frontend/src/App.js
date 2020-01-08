import React, {Component} from 'react'
import "antd/dist/antd.css";
import css from './App.module.css'
import {Layout} from 'antd'
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
import {
    Page404,
    Page500,
    Page503Component
} from "./components/Common/Pages/Pages";
import {redirectHoc} from "./hoc/redirectTo";
import Preloader from "./components/Common/Preloader/Preloader";
import Header from "./components/Header/HeaderContainer";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import UsersContainer from "./components/Users/UsersContainer";
import Register from "./components/Register/Register";
import ProfileContainer from "./components/Profile/ProfileContainer";
import DomainsContainer from "./components/Domains/DomainsContainer";
import DomainCreateContainer from "./components/Domain/DomainCreateContainer";
import DomainDetailContainer from "./components/Domain/DomainDetailContainer";
import DomainEditContainer from "./components/Domain/DomainEditContainer";
import CompaniesContainer from "./components/Companies/CompaniesContainer";
import CompanyEditContainer from "./components/Company/CompanyEditContainer";
import CompanyCreateContainer from "./components/Company/CompanyCreateContainer";
import BreadcrumbComponent from "./components/Breadcrumb/Breadcrumb";
import TasksContainer from "./components/Tasks/TasksContainer";
import SettingsContainer from "./components/Settings/SettingsContainer";
import StatusEditContainer from "./components/Settings/Statuses/StatusEditContainer";
import StatusCreateContainer
    from "./components/Settings/Statuses/StatusCreateContainer";
import CodeEditContainer from "./components/Settings/Codes/CodeEditContainer";
import CodeCreateContainer
    from "./components/Settings/Codes/CodeCreateContainer";


const { Content } = Layout;


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
                    <BreadcrumbComponent />
                    <div className={css.appWrapperContent}>
                        <Switch>
                            <Route path='/404' render={() => <Page404 />} />
                            <Route path='/500' render={() => <Page500 />} />
                            <Route path='/503' render={() => <Page503Component />} />

                            <Route path='/login' render={() => <Login />}/>
                            <Route path='/register' render={() => <Register />}/>
                            <Route path='/profile' render={() => <ProfileContainer />}/>

                            <Route path='/users' render={() => <UsersContainer />}/>

                            <Route exact path='/domains/create' render={() => <DomainCreateContainer />}/>
                            <Route exact path='/domains/:domainId/edit' render={() => <DomainEditContainer />}/>
                            <Route exact path='/domains/:domainId(\d+)' render={() => <DomainDetailContainer />}/>
                            <Route path='/domains' render={() => <DomainsContainer />}/>

                            <Route path='/companies/create' render={() => <CompanyCreateContainer />}/>
                            <Route path='/companies/:companyId' render={() => <CompanyEditContainer />}/>
                            <Route path='/companies' render={() => <CompaniesContainer />}/>

                            <Route path='/tasks/create' render={() => <TasksContainer />}/>
                            <Route path='/tasks' render={() => <TasksContainer />}/>

                            <Route exact path='/settings/statuses/:statusId(\d+)' render={() => <StatusEditContainer />}/>
                            <Route exact path='/settings/statuses/create' render={() => <StatusCreateContainer />}/>

                            <Route exact path='/settings/codes/:codeId(\d+)' render={() => <CodeEditContainer />}/>
                            <Route exact path='/settings/codes/create' render={() => <CodeCreateContainer />}/>

                            <Route path='/settings' render={() => <SettingsContainer />}/>

                            <Redirect exact from="/" to="/profile" />

                            <Route path='**' render={() => <Page404 />} />

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
    redirectHoc,
    showMessage,
)(App);


const MainApp = () => {
    return (
        <BrowserRouter>
            <Provider store={store} >
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
};

export default MainApp