import Ripples from 'react-ripples';
import StarRatingComponent from 'react-star-rating-component';

function DesignerCard(props) {
    return (
        <div className="card item-card">
            <Ripples>
                <img src={props.image} className="card-image" alt={props.name} />
            </Ripples>
            <div className="card-body">
                <p className="card-text">{props.name}</p>
                <StarRatingComponent
                    name={props.name}
                    starCount={5}
                    value={props.rating}
                    starColor="#9400D3"
                />
                <span className="rating-text">{props.rating}</span>
            </div>
        </div>
    );
}

export default DesignerCard;