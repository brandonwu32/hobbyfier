import "./EventCard.css";

function EventCard(props) {
    return (
        <div className = "event-card">
            <div className = "left-half">
                <h1>{props.weekday}</h1>
                <h3>{props.date}</h3>

            </div>
            <div className = "right-half">
                <h1>{props.title}</h1>
                <div>details: <p>{props.details}</p></div>
                <div>weather: <p>{props.weather}</p></div>
                <div>time: <p>{props.time}</p></div>
            </div>
        </div>
    )
}