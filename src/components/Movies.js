import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Movies.scss"; // Import file SCSS
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form"; // Import Form for search functionality

const pageSize = 6; // Mỗi trang sẽ hiển thị 6 movies (2 hàng, mỗi hàng 3 movies)

function Movies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get("http://localhost:5088/api/movies")
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the movies!", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      fetchMovies();
      return;
    }

    axios.get(`http://localhost:5088/api/movies/search?query=${searchQuery}`)
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error("There was an error searching for movies!", error);
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBookClick = (movieId) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      navigate(`/booking/${movieId}`);
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const selectedMovies = movies.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(movies.length / pageSize);

  const renderMovies = () => {
    const rows = [];
    for (let i = 0; i < selectedMovies.length; i += 3) {
      rows.push(
        <Row key={i} className="mb-3">
          {selectedMovies.slice(i, i + 3).map((movie, index) => (
            <Col key={index} md={4} className="movie-card">
              <Card>
                <Card.Img variant="top" src={movie.image} />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>{movie.genre}</Card.Text>
                  <Button
                    style={{ cursor: "pointer" }}
                    variant="danger"
                    onClick={() => handleBookClick(movie.id)}
                  >
                    Book
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }
    return rows;
  };

  return (
    <>
      <div className="movies-container">
        <Form onSubmit={handleSearch} className="search-form">
          <Form.Group controlId="formSearch">
            <Form.Control
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Search</Button>
        </Form>
        {showAlert && (
          <Alert variant="danger" className="alert-message">
            Bạn cần đăng nhập để mua vé.
          </Alert>
        )}
        {renderMovies()}
      </div>
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            className="page-button"
            variant="secondary"
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </>
  );
}

export default Movies;
