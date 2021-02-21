import Ripples from 'react-ripples';

function MediaCard(props) {
    const primaryImage = props.image ? "https://imgs.fabrik.in/5456734/fill/400/400/sm/0/plain/https://fabrik.sgp1.digitaloceanspaces.com/images/" + props.image : "https://dummyimage.com/355x266/563d7c/ffffff&text=" + props.name;
    return (
        <div className="card item-card">
            <Ripples>
                <img src={primaryImage} className="card-image" alt={props.name} />
            </Ripples>
            <div className="card-body">
                <span className="badge badge-primary card-rating float-right">{props.rating}</span>
            </div>
        </div>
    );
}

export default MediaCard;