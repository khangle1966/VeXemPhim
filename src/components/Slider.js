import React from 'react';
import Carousel from "react-bootstrap/Carousel";
import Image1 from "../images/slider1/1.png";
import Image2 from "../images/slider1/2.png";
import Image3 from "../images/slider1/3.jpg";
import './Slider.css'; // Import CSS file

function Slider() {
  return (
    <Carousel variant="dark">
      <Carousel.Item interval={1000}>
        <img className="d-block w-100" src={Image1} alt="First slide" />
        <Carousel.Caption>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img className="d-block w-100" src={Image2} alt="Second slide" />
        <Carousel.Caption>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={Image3} alt="Third slide" />
        <Carousel.Caption>

        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;
