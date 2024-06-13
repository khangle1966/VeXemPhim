import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function SignupModal({ show, handleClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [afterSignup, setAfterSignup] = useState("");

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:5088/api/Auth/register", {
                username: username,
                password: password,
            })
            .then((response) => {
                setAfterSignup("Registration successful!");
            })
            .catch((error) => {
                setAfterSignup("Registration failed. Please try again.");
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <div>{afterSignup}</div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignupModal;
