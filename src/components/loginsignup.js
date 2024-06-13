import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import SignupModal from "./SignupModal"; // Adjust the import path as needed
import "./loginsignup.scss"; // Import SCSS file

export default function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [afterLogin, setAfterLogin] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5088/api/Auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data); // Check the response data
        if (response.data.message === "Login successful") {
          const userRole = response.data.role;
          localStorage.setItem("username", username); // Lưu username vào localStorage
          localStorage.setItem("role", userRole); // Lưu role vào localStorage
          localStorage.setItem("isAuthenticated", "true"); // Lưu trạng thái đăng nhập vào localStorage
          setAfterLogin("Login successful!");
          handleLogin(username, userRole);
        } else {
          setAfterLogin(response.data.message); // Display the exact message from the server
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setAfterLogin(error.response.data); // Display the exact error message from the server
        } else {
          setAfterLogin("Login failed. Please check your credentials.");
        }
      });
  }

  return (
    <>
      <Form className="login-form">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={handleUsernameChange}
            type="text"
            placeholder="Enter Username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handlePasswordChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Button

          variant="secondary"
          onClick={() => setShowSignup(true)}
        >
          SignUp
        </Button>
        <div className="after-login-message">{afterLogin}</div>
      </Form>
      <SignupModal show={showSignup} handleClose={() => setShowSignup(false)} />
    </>
  );
}
