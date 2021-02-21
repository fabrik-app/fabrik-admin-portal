import Ripples from 'react-ripples';

function SmallStoreCard(props) {
    return (
        <div className="card item-card">
            <Ripples>
                <img src={props.image} className="card-image" alt={props.name} />
            </Ripples>
            <div className="card-body">
                <p className="card-text">{props.name}</p>
            </div>
        </div>
    );
}

export default SmallStoreCard;