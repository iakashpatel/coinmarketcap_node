import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import Jumbotron from "react-bootstrap/Jumbotron";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";
const axios = require("axios");
const yup = require("yup");

const schema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
});

function Profile() {
  let history = useHistory();
  const [invalid, setInvalid] = useState(false);

  const [user, setUser] = useState({ authenticated: false });
  const { user: userDetails = {} } = user || {};
  const { first_name = "", last_name = "", email = "", _id = "" } = userDetails;

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
      history.replace("/login");
      console.log("error-checkuser", error);
    }
  }

  async function updateuser(updatedData) {
    try {
      setInvalid(false);
      const profile = await axios.patch(`/users/update/${_id}`, {
        ...updatedData
      });
      const { data = {} } = profile;
      const { user: userData = {} } = data;
      const { _id: userId = "" } = userData;

      if (!userId) {
        history.replace("/login");
      } else {
        history.replace("/");
      }
    } catch (error) {
      setInvalid(true);
      console.log("error-checkuser", error);
    }
  }

  useEffect(() => {
    authUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <Formik
            enableReinitialize
            validationSchema={schema}
            onSubmit={updateuser}
            initialValues={{
              first_name: first_name,
              last_name: last_name,
              email: email
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
                        <Alert variant={"danger"}>Failed to update user!</Alert>
                      )}
                      <h1>View/update Profile</h1>
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
                            placeholder="new Password"
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
                          Update
                        </Button>
                      </Form>
                    </Jumbotron>
                  </Col>
                </Row>
              </div>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;
