import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const PostReview = () => {
  const { id } = useParams();   
  const navigate = useNavigate();
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  // These MUST match your djangoapp/urls.py exactly
  const dealer_url = `/api/dealer/${id}`;
  const review_url = `/api/add_review`;
  const carmodels_url = `/api/get_cars`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      // Django often wraps the object in a key or returns it directly
      const data = retobj.dealer ? (Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer) : retobj;
      setDealer(data);
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url);
      const retobj = await res.json();
      setCarmodels(retobj.CarModels || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [id]);

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null") || name.trim() === "") {
      name = sessionStorage.getItem("username");
    }

    if (!model || review.trim() === "" || date === "" || year === "") {
      alert("All fields are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": parseInt(year),
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsoninput,
      });

      if (res.ok) {
        // Redirect back to the dealer page to see the new review
        navigate(`/dealer/${id}`);
      } else {
        alert("Failed to post review. Ensure you are logged in.");
      }
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name || dealer.name || "Loading..."}</h1>
        <textarea 
          placeholder="Write your review here..."
          onChange={(e) => setReview(e.target.value)}
          style={{ width: "100%", height: "150px" }}
        />
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className='input_field'>
          Car Make & Model
          <select onChange={(e) => setModel(e.target.value)}>
            <option value="" selected disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((car, index) => (
              <option key={index} value={`${car.car_make} ${car.car_model}`}>
                {car.car_make} {car.car_model}
              </option>
            ))}
          </select>
        </div>
        <div
        className='input_field'>
          Car Year <input type="number" min="2015" max="2026" onChange={(e) => setYear(e.target.value)} />
        </div>
        <button className='postreview' onClick={postreview}>Post Review</button>
      </div>
</div>
  );
};

export default PostReview;