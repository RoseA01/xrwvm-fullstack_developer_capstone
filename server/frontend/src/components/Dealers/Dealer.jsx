import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

import Header from '../Header/Header';

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const dealer_url = `/api/dealer/${id}`;
  const reviews_url = `/api/reviews/dealer/${id}`;
  const post_review_url = `/api/postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();

      if (retobj.status === 200) {
        const dealerData = Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer;
        setDealer(dealerData || {});
      }
    } catch (error) {
      console.error("Error fetching dealer details:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const retobj = await res.json();

      console.log("Reviews response:", retobj);

      if (retobj.status === 200) {
        setReviews(retobj.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  useEffect(() => {
    if (id) {
      get_dealer();
      get_reviews();
    }
  }, [id]);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "20px" }}>
        <h1 style={{ color: "grey", display: "flex", alignItems: "center", gap: "15px" }}>
          {dealer.full_name || dealer.name || "Dealer"}
          {isLoggedIn && (
            <a href={post_review_url}>
              <img 
                src={review_icon} 
                style={{ width: '90px', height: '55px' }} 
                alt="Write Review" 
              />
            </a>
          )}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {loading ? (
          <p>Loading Reviews....</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review_panel">
              <img 
                src={senti_icon(review.sentiment)} 
                className="emotion_icon" 
                alt={review.sentiment} 
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} • {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;