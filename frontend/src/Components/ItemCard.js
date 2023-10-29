import "./ItemCard.css";

function ItemCard(props) {
    return (
        <div className="itemcard-box">
            <h2>{props.title}</h2>
            <div className ="itembox-info">
                <p>{props.time}</p>
                <p className = "event-description">{props.desc}</p>
            </div>
        </div>
    );
}

export default ItemCard;