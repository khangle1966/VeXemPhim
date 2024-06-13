import Nav from "react-bootstrap/Nav";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import Popup from "reactjs-popup";
import Login from "./loginsignup";
import "./Navigation.scss"; // Import file SCSS

function Navigation({ isAuthenticated, onLogout, onLogin }) {
  const [loginStatus, setLoginStatus] = useState("Login/SignUp");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // Thêm trạng thái role
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role"); // Lấy role từ localStorage
    if (storedUsername) {
      setUsername(storedUsername);
      setRole(storedRole); // Đặt trạng thái role
      setLoginStatus(`Hello, ${storedUsername}`);
    } else {
      setLoginStatus("Login/SignUp");
    }
  }, [isAuthenticated]);

  function handleLogin(username, userRole) {
    setLoginStatus(`Hello, ${username}`);
    setUsername(username);
    setRole(userRole); // Đặt trạng thái role
    setIsPopupOpen(false); // Tắt popup sau khi đăng nhập thành công
    onLogin(username, userRole); // Gọi hàm onLogin để cập nhật trạng thái đăng nhập
  }

  function handleLogout() {
    onLogout(); // Gọi hàm onLogout từ props để cập nhật trạng thái đăng xuất
    setLoginStatus("Login/SignUp");
    setUsername("");
    setRole(""); // Xóa trạng thái role
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  return (
    <>
      <Container className="container">
        <Row>
          <Col>
            <Nav className="justify-content-center" activeKey="/home">
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" href="/movies">Movies</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" eventKey="link-1">Stream</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" eventKey="link-2">Event</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" eventKey="link-3">Plays</Nav.Link>
              </Nav.Item>
              {role === "admin" && ( // Kiểm tra role và hiển thị Admin nếu là admin
                <Nav.Item className="nav-item">
                  <Nav.Link className="nav-link" href="/admin">Admin</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Col>
          <Col>
            <Nav className="justify-content-center" activeKey="/home">
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" href="/home">List Your Shows</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" eventKey="link-1">Gift Card</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link className="nav-link" eventKey="link-2">Offers</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                {!isAuthenticated ? (
                  <Popup
                    trigger={<Nav.Link className="nav-link" eventKey="link-3">{loginStatus}</Nav.Link>}
                    modal
                    nested
                    open={isPopupOpen}
                    onOpen={() => setIsPopupOpen(true)}
                    onClose={() => setIsPopupOpen(false)}
                    closeOnDocumentClick
                    className="popup-content"
                  >
                    <div>
                      <Login handleLogin={handleLogin} />
                    </div>
                  </Popup>
                ) : (
                  <>
                    <p style={{ margin: "0 10px", cursor: "default" }}>{`Hello, ${username}`}</p>
                    <Nav.Link as="span" className="logout-link" eventKey="link-4" onClick={handleLogout}>
                      Logout
                    </Nav.Link>
                  </>
                )}
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Navigation;
