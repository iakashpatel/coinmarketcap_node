import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";

function Dashboard() {
  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <Jumbotron>
            <h1>Welcome to Coinmarketcap!</h1>
            <p>
              <Button variant="primary" href="/profile">
                View profile
              </Button>
            </p>
          </Jumbotron>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
