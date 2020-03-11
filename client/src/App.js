import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navigation from "./containers/Navigation";
import Main from "./containers/Main";
import { useHistory } from "react-router-dom";
const axios = require("axios");

function App() {
  let history = useHistory();
  const [user, setUser] = useState({ authenticated: false });
  const { authenticated = false } = user;
  const { location = {} } = history || {};
  const { pathname = "" } = location;
  useEffect(() => {
    if (authenticated && (pathname === "/login" || pathname === "/")) {
      history.replace("/dashboard");
    }
    // eslint-disable-next-line
  }, [authenticated]);

  async function authUser() {
    try {
      const profile = await axios.get("/users/profile");
      const { data } = profile;
      if (!data.authenticated) {
        history.replace("/login");
      } else {
        setUser(data);
      }
    } catch (error) {
      console.log("error-checkuser", error);
    }
  }

  async function logout() {
    try {
      const result = await axios.get("/users/logout");
      const { data } = result;
      const { success } = data;
      if (success) {
        setUser({ authenticated: false });
        history.replace("/login");
      }
    } catch (error) {
      console.log("logout-error", error);
    }
  }

  useEffect(() => {
    authUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Navigation user={user} logout={logout} />
      <Main />
    </Container>
  );
}

export default App;
