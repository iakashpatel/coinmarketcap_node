import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Formik } from "formik";
const yup = require("yup");
const axios = require("axios");
const facebookLoginUrl = process.env.REACT_APP_FACEBOOK_LOGIN;
const googleLoginUrl = process.env.REACT_APP_GOOGLE_LOGIN;

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

function Signin() {
  const [invalid, setInvalid] = useState(false);

  async function loginUser(data) {
    try {
      setInvalid(false);
      const result = await axios.post("/users/login", {
        ...data
      });
      if (result && result.status === 200) {
        const profile = await axios.get("/users/profile");
        const { data } = profile;
        if (data.authenticated) {
          window.location.reload();
        }
      } else {
        setInvalid(true);
      }
    } catch (error) {
      setInvalid(true);
      console.log("error,signup function", error);
    }
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={loginUser}
      initialValues={{
        email: "",
        password: ""
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors
      }) => (
        <div>
          <Row>
            <Col xs={12} md={12}>
              <Jumbotron>
                {invalid && (
                  <Alert variant={"danger"}>Failed to authenticat user!</Alert>
                )}
                <h1>Login</h1>
                <br />
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isValid={touched.email && !errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isValid={touched.password && !errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <br />
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
                <br />
                <div>
                  <Row className="justify-content-md-center">
                    <Col lg="2" md="2" xs>
                      <Button
                        variant="primary"
                        href={facebookLoginUrl}
                      >
                        Signin with Facebook
                      </Button>{" "}
                    </Col>
                    <Col md="auto"></Col>
                    <Col lg="2" md="2" xs>
                      <Button
                        variant="danger"
                        href={googleLoginUrl}
                      >
                        Signin with Google
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Jumbotron>
            </Col>
          </Row>
        </div>
      )}
    </Formik>
  );
}

export default Signin;
