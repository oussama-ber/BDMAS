import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// components
import Header from "./shared/layout/Header";
import Dashboard from "./shared/pages/Dashboard";
import Footer from "./shared/layout/Footer";

// context
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

// AUTH
import Auth from "./Auth/Pages/Auth";
import ResetPassword from "./Auth/Pages/ResetPassword";
import SetPassword from "./Auth/Pages/SetPassword";
import ActivateAccount from "./user/pages/ActivateAccount";

// USER
import UserProjects from "./projects/pages/UserProjects";
import Users from "./user/pages/Users";

// PROJECT
import Projects from "./projects/pages/Projects";
import Profile from "./user/pages/Profile";
import ProjectDetailed from "./projects/pages/ProjectDetailed";

//FORMS
import Forms from "./QuestionForm/Pages/Forms";
import GetForm from "./QuestionForm/Form-Creation/GetForm";
import FormBuilder from "./QuestionForm/Form-CreationV2/Pages/FormBuilder";
import CreateForm from "./QuestionForm/Form-Creation/CreateForm";
import UpdateForm from "./QuestionForm/Form-CreationV2/Pages/UpdateForm";
import SurveyOne from "./QuestionForm/Testing/surveyDisplay";
import Testt from "./QuestionForm/Testing/testt";
// CLIENT
import BankMember from "./QuestionForm/Bank-Member-View/BankMember";
import TestMember from "./QuestionForm/Bank-Member-View/TestMember";

// SESSION
import MainSession from "./Sessions/Pages/MainSession";

import ChartProjectItem from "./projects/components/ChartProjectItem";

import UserDashboard from "./shared/pages/UserDashboard";
// Comparison
import MainPage from "./Comparison/Pages/MainPage";

const App = () => {
  const { userId, token, login, logout, role, image } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/user/dashboard" exact>
          <UserDashboard />
        </Route>
        {/* PROJECT MANAGEMENT */}
        <Route path="/projects" exact>
          <Projects />
        </Route>
        <Route path="/projects/detailedview/:projectId">
          <ProjectDetailed />
        </Route>
        <Route path="/project/:pid/session/details/:sid" exact>
          <MainSession />
        </Route>
        {/* USER MANAGEMNT */}
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/:userId/projects" exact>
          <UserProjects />
        </Route>
        {/* Comparison */}
        <Route path="/comparison" exact>
          <MainPage />
        </Route>
        {/* FORM MANAGMENT */}
        <Route path="/forms" exact>
          <Forms />
        </Route>
        <Route path="/createv2" exact>
          <FormBuilder />
        </Route>
        <Route path="/form/:formId" exact>
          <GetForm />
        </Route>
        <Route path="/form/update/:formId" exact>
          <UpdateForm />
        </Route>
        <Route path="/profile" exact>
          <Profile />
        </Route>
        <Redirect to="/user/dashboard" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/authenticate" exact>
          <Auth />
        </Route>
        <Route path="/survey">
          <SurveyOne />
        </Route>
        <Route path="/user/reset-password" exact>
          <ResetPassword />
        </Route>
        <Route path="/user/resetpassword/:secretToken">
          <SetPassword />
        </Route>
        <Route path="/question-form/new">
          <CreateForm />
        </Route>
        <Route path="/blabla">
          <Testt />
        </Route>
        <Route path="/user/activate/:secretToken" exact>
          <ActivateAccount />
        </Route>
        <Route path="/chart" exact>
          <ChartProjectItem />
        </Route>
        {/* TODO */}
        <Route
          path="/project/:pid/session/:sid/subsession/:ssid/form/:fid/token/:token"
          exact
        >
          <BankMember />
        </Route>
        <Route path="/form/test" exact>
          <TestMember />
        </Route>
        {/*  IMPORTANT TODO  */}
     
        <Redirect to="/authenticate" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        role: role,
        userId: userId,
        image: image,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <div style={{ position: "relative" }}>
          <Header style={{ height: "10vh" }} />
          <main
            style={{ minHeight: "80vh", background: "#1A1A24", padding: 30 }}
          >
            {routes}
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
