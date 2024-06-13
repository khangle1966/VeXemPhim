import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import './Admin.scss';

const Admin = () => {
    const generateSeats = () => {
        const seats = [];
        const rows = ['A', 'B', 'C', 'D'];
        const columns = [1, 2, 3, 4, 5, 6];

        rows.forEach(row => {
            columns.forEach(col => {
                seats.push({ number: `${row}${col}`, isBooked: false, price: 130000 });
            });
        });

        return seats;
    };

    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [image, setImage] = useState('');
    const [showtimes, setShowtimes] = useState([{ time: '', seats: generateSeats() }]);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        axios.get('http://localhost:5088/api/movies')
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the movies!', error);
            });
    };

    const handleAddShowtime = () => {
        setShowtimes([...showtimes, { time: '', seats: generateSeats() }]);
    };

    const handleShowtimeChange = (index, value) => {
        const newShowtimes = [...showtimes];
        newShowtimes[index].time = value;
        setShowtimes(newShowtimes);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newMovie = {
            title,
            genre,
            releaseDate,
            image,
            showtimes: showtimes.map(showtime => ({
                time: new Date(showtime.time).toISOString(),
                seats: showtime.seats
            }))
        };

        console.log(newMovie);  // Thêm dòng này để kiểm tra dữ liệu

        if (selectedMovie) {
            axios.put(`http://localhost:5088/api/movies/${selectedMovie.id}`, { ...newMovie, id: selectedMovie.id }) // Truyền ID hiện tại vào đối tượng mới
                .then(response => {
                    console.log(response.data);
                    alert('Movie updated successfully');
                    fetchMovies(); // Refresh the list of movies
                })
                .catch(error => {
                    console.error('There was an error updating the movie!', error);
                });
        } else {
            axios.post('http://localhost:5088/api/movies', newMovie)
                .then(response => {
                    console.log(response.data);
                    alert('Movie added successfully');
                    fetchMovies(); // Refresh the list of movies
                })
                .catch(error => {
                    console.error('There was an error adding the movie!', error);
                });
        }

        // Reset form fields
        setTitle('');
        setGenre('');
        setReleaseDate('');
        setImage('');
        setShowtimes([{ time: '', seats: generateSeats() }]);
        setSelectedMovie(null);
    };

    const handleDelete = (movieId) => {
        axios.delete(`http://localhost:5088/api/movies/${movieId}`)
            .then(response => {
                console.log(response.data);
                alert('Movie deleted successfully');
                fetchMovies(); // Refresh the list of movies
            })
            .catch(error => {
                console.error('There was an error deleting the movie!', error);
            });
    };

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
        setTitle(movie.title);
        setGenre(movie.genre);
        setReleaseDate(movie.releaseDate.split('T')[0]); // Format date to YYYY-MM-DD
        setImage(movie.image);
        setShowtimes(movie.showtimes.map(showtime => ({
            time: new Date(showtime.time).toISOString().slice(0, 16),
            seats: showtime.seats
        })));
    };

    return (
        <Container className="admin-container">
            <h1 className="admin-title">Admin - Add/Edit Movie</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formGenre">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formReleaseDate">
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter release date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" placeholder="Enter image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formShowtimes">
                    <Form.Label>Showtimes</Form.Label>
                    {showtimes.map((showtime, index) => (
                        <Row key={index}>
                            <Col>
                                <Form.Control type="datetime-local" value={showtime.time} onChange={(e) => handleShowtimeChange(index, e.target.value)} required />
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" onClick={handleAddShowtime}>Add Showtime</Button>
                </Form.Group>

                <Button variant="primary" type="submit">{selectedMovie ? 'Update Movie' : 'Add Movie'}</Button>
            </Form>

            <h2 className="admin-title">Existing Movies</h2>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Movie
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {movies.map(movie => (
                        <Dropdown.Item key={movie.id} onClick={() => handleSelectMovie(movie)}>{movie.title}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {selectedMovie && (
                <Button variant="danger" onClick={() => handleDelete(selectedMovie.id)} style={{ marginTop: '20px' }}>Delete Movie</Button>
            )}
        </Container>
    );
};

export default Admin;
