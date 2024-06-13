import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import "./Booking.scss"; // Import file SCSS

function Booking() {
    const { id } = useParams(); // Lấy movie id từ URL
    const [movie, setMovie] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showtimeIndex, setShowtimeIndex] = useState(0);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5088/api/movies/${id}`)
            .then(response => {
                setMovie(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the movie!", error);
                setErrorMessage("There was an error fetching the movie data.");
            });
    }, [id]);

    const handleSeatClick = (seatNumber) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatNumber)
                ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
                : [...prevSelectedSeats, seatNumber]
        );
    };

    const handleShowtimeChange = (index) => {
        setShowtimeIndex(index);
        setSelectedSeats([]);
    };

    const handleBooking = () => {
        const selectedShowtime = movie.showtimes[showtimeIndex];
        const promises = selectedSeats.map(seatNumber => {
            return axios.post("http://localhost:5088/api/tickets", {
                movieId: movie.id,
                showtime: selectedShowtime.time,
                seatNumber: seatNumber,
                price: selectedShowtime.seats.find(seat => seat.number === seatNumber).price
            });
        });

        Promise.all(promises)
            .then(responses => {
                const updatedShowtimes = movie.showtimes.map((showtime, index) => {
                    if (index === showtimeIndex) {
                        return {
                            ...showtime,
                            seats: showtime.seats.map(seat => ({
                                ...seat,
                                isBooked: selectedSeats.includes(seat.number) ? true : seat.isBooked
                            }))
                        };
                    }
                    return showtime;
                });

                setMovie(prevMovie => ({ ...prevMovie, showtimes: updatedShowtimes }));
                setSelectedSeats([]);
                setBookingSuccess(true);
                setErrorMessage("");
            })
            .catch(error => {
                console.error("There was an error booking the ticket!", error);
                setErrorMessage("There was an error booking the ticket. Please try again.");
                setBookingSuccess(false);
            });
    };

    if (!movie) {
        return <div>Loading...</div>;
    }

    const selectedShowtime = movie.showtimes[showtimeIndex];
    const totalAmount = selectedSeats.reduce((total, seatNumber) => {
        const seatPrice = selectedShowtime.seats.find(seat => seat.number === seatNumber).price;
        return total + seatPrice;
    }, 0);

    return (
        <div className="booking-container">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {bookingSuccess && <Alert variant="success">Booking successful!</Alert>}
            <Button variant="secondary" onClick={() => navigate("/movies")} className="back-button">
                &lt; Trở lại
            </Button>
            <Card className="movie-details">
                <Card.Img variant="top" src={movie.image} />
                <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>{movie.genre}</Card.Text>
                    <Card.Text>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</Card.Text>
                    <div className="showtime-selector">
                        {movie.showtimes.map((showtime, index) => (
                            <Button
                                key={index}
                                variant={showtimeIndex === index ? "primary" : "secondary"}
                                onClick={() => handleShowtimeChange(index)}
                            >
                                {new Date(showtime.time).toLocaleString()}
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>
            <div className="seat-selection">
                <h3>Select your seats:</h3>
                <div className="seats">
                    {selectedShowtime.seats.map((seat) => (
                        <Button
                            key={seat.number}
                            className={`seat ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.number) ? 'selected' : ''}`}
                            onClick={() => !seat.isBooked && handleSeatClick(seat.number)}
                            disabled={seat.isBooked}
                        >
                            {seat.number}
                        </Button>
                    ))}
                </div>
                <div className="total-amount">
                    <h4>Total Amount: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
                </div>
                <Button className="book-button" onClick={handleBooking} disabled={selectedSeats.length === 0}>
                    Book Selected Seats
                </Button>
            </div>
        </div>
    );
}

export default Booking;
