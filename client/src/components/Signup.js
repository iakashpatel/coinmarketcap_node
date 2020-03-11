import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";
const yup = require("yup");
const axios = require("axios");

const schema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
});

function Signup() {
  let history = useHistory();
  const [invalid, setInvalid] = useState(false);

  async function registerUser(data) {
    try {
      setInvalid(false);
      const result = await axios.post("/users/register", {
        ...data
      });
      if (result) {
        history.push("/login");
      }
    } catch (error) {
      setInvalid(true);
      console.log("error,signup function", error);
    }
  }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={registerUser}
      initialValues={{
        first_name: "Mark",
        last_name: "Otto"
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
                  <Alert variant={"danger"}>Failed to register!</Alert>
                )}
                <h1>Signup</h1>
                <br />
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicName1">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first Name"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      isValid={touched.first_name && !errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formBasicName2">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last Name"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      isValid={touched.last_name && !errors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a name.
                    </Form.Control.Feedback>
                  </Form.Group>

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
                      Please provide a email.
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
                      Please provide a password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <br />
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Jumbotron>
            </Col>
          </Row>
        </div>
      )}
    </Formik>
  );
}

export default Signup;
