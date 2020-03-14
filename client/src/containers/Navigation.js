import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function Navigation(props) {
  const { user = {}, logout } = props;
  const { authenticated = false } = user;

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Coinmarketcap Tracker</Navbar.Brand>
        <Nav className="mr-auto">
          {/* <Nav.Link href="/">Home</Nav.Link> */}
        </Nav>
        <Nav>
          {!authenticated && <Nav.Link href="/signup">Register</Nav.Link>}
          {!authenticated && <Nav.Link href="/login">Login</Nav.Link>}
          {authenticated && <Nav.Link href="/profile">My Profile</Nav.Link>}
          {authenticated && <Nav.Link onClick={logout}>Logout</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigation;
