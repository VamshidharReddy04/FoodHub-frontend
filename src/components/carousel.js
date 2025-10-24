import React from "react";

export default function Carousel({ search, setSearch }) {
  // use passed props; keep form submit prevented
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-caption" style={{ zIndex: '10' }}>
          <div><h1>Welcome to FoodHub </h1><br /><h4>Where your cravings are satisfied</h4></div>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://images.pexels.com/photos/4439740/pexels-photo-4439740.jpeg"
              className="d-block w-100 carousel-img"
              style={{ objectFit: 'cover', filter: 'brightness(30%)' }} alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
              className="d-block w-100 carousel-img"
              style={{ objectFit: 'cover', filter: 'brightness(30%)' }} alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg"
              className="d-block w-100 carousel-img"
              alt="..."
              style={{ objectFit: 'cover', filter: 'brightness(30%)' }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg"
              className="d-block w-100 carousel-img"
              alt="..."
              style={{ objectFit: 'cover', filter: 'brightness(30%)' }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}
