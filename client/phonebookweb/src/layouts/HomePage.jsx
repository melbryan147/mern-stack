import React from "react";
import "./HomePage.css"; // ✅ Import animation styles

function HomePage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h1 className="display-3 fw-bold text-center jumping-text">
        <span className="text-warning">Phone</span>
        <span className="text-primary">Book</span>
        <span className="text-success">Web</span>
      </h1>
    </div>
  );
}

export default HomePage;
