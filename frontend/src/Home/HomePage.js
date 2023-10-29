import "./HomePage.css";
import Button from "../Components/Button.js";
import console from "../assets/console.svg";
import burger from "../assets/burger.svg";
import basketball from "../assets/basketball.svg";
import popcorn from "../assets/popcorn.svg";

function HomePage() {
    return (
        <div className = "home-page">
            <img alt="" src={console} className = "console-img" id = "float1"></img>
            <img alt="" src={burger} className = "burger-img" id = "float2"></img>
            <img alt="" src={basketball} className = "basketball-img" id = "float3"></img>
            <img alt="" src={popcorn} className = "popcorn-img" id = "float4"></img>
            <h1 className = "header-home" >hobbyfier</h1>
            <p className = "text">diversify your hobbies with personalized recommendations based on your calendar.</p>
            <div className = "button-container">
                <Button text="get started!"/>
            </div>
        </div>
    );
}

export default HomePage;