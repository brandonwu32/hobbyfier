import "./RecommendationsPage.css";
import ItemCard from "../Components/ItemCard.js";
import React, { useState, useEffect } from "react";

function RecommendationsPage() {

    const [data, setdata] = useState({
        name: "",
        age: 0,
        date: "",
        programming: "",
    });

    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    name: data.Name,
                    age: data.Age,
                    date: data.Date,
                    programming: data.programming,
                });
            })
        );
    }, []);

    return (
        <div className="recommendation-page">
            <div className = "event-card">
                <h2>Synchronized Swimming</h2>
                <div>
                    <h3>details:</h3><p>synchronized swimming is a fun way to practice swimming with your friends.</p>
                </div>
                <div>
                    <h3>weather:</h3>
                    <p>you can expect thunderstorms and a category 3 hurricane, which is perfect for outdoor swimming.</p>
                </div>
                <div>
                    <h3>time:</h3>
                    <p> based on your availability and weather conditions, 3:00 PM is a good time for this activity.</p>
                </div>
            </div>


            <div className = "recommendations">
                <div className = "recommendations-title"><h1>recommendations</h1></div>

                <div className = "recommendations-card">
                    <ItemCard title="bowling" time = "3-4pm" desc = "for some friendly competition" />
                    <ItemCard title="take a walk" time = "1-2pm" desc = "get your steps in" />

                </div>
            </div>
        </div>
    );
}

export default RecommendationsPage;