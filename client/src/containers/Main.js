import React from "react";
import {Switch, Route } from "react-router-dom";
import Home from "../components/Home";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";
import ChartPage from "../components/Charts";

function Main() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Signin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/charts" component={ChartPage} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}

export default Main;
