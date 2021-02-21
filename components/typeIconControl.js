import * as React from 'react';
export default class TypeIconControl extends React.Component {
    render() {
        if (!this.props.type) {
            return null;
        }

        if(this.props.type == "landline"){
            return(
                <i className="fas fa-phone" />
            );
        }
        else if(this.props.type == "mobile"){
            return(
                <i className="fas fa-mobile" />
            );
        }
        else if(this.props.type == "email"){
            return(
                <i className="far fa-envelope" />
            );
        }
        else if(this.props.type == "whatsapp"){
            return(
                <i className="fab fa-whatsapp" />
            );
        }
        else if(this.props.type == "facebook"){
            return(
                <i className="fab fa-facebook" />
            );
        }
        else if(this.props.type == "twitter"){
            return(
                <i className="fab fa-twitter" />
            );
        }
        else if(this.props.type == "instagram"){
            return(
                <i className="fab fa-instagram" />
            );
        }
        else if(this.props.type == "pinterest"){
            return(
                <i className="fab fa-pinterest" />
            );
        }
        else if(this.props.type == "youTube"){
            return(
                <i className="fab fa-youtube" />
            );
        }
        else {
            return null;
        }
    }
}