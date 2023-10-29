import "./Button.css";

function Button(props) {
    return (
        <button className = "button-comp">
            <div className = "button-interior"><p className = "button-text">{props.text}</p></div>
        </button>
    )
}

export default Button;