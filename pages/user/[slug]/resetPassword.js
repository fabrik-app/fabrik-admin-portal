import React from 'react';
import { config } from '../../../config';
import axios from 'axios';
import { privateRoute } from '../../../privateRoute';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      data: {
        newPassword: "",
        confirmNewPassword: "",
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {

    const names = e.target.name.split(".");
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    this.setState((state) => {
      if (names.length == 2) {
        this.state[names[0]][names[1]] = value;
        return { [names[0]]: this.state[names[0]] };
      }
      else if (names.length == 3) {
        this.state[names[0]][names[1]][names[2]] = value;
        return { [names[0]]: this.state[names[0]] };
      }
      else {
        this.state[names[0]] = value;
        return { [names[0]]: this.state[names[0]] };
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.data.changepassword.newPassword != this.data.changepassword.confirmNewPassword){
        alert("New password and confirm new password should be same");
        return;
    }

    this.setState({
      isBusy: true
    });

    var dataApiEndpoint = config.apiBaseUrl + 'users/reset-password';
    axios.put(dataApiEndpoint, this.state.data,  {
        headers: { Authorization: `Bearer ${this.props.auth.token}` }
      })
      .then(apiResult => {

        this.setState({
          isBusy: false,
          data: {
            newPassword: "",
            confirmNewPassword: "",
          }
        });

        alert("Reset Password Successfully");
      })
      .catch(error => alert(error));
  }
  render() {
    return (
      <div>
        <div className="container my-5">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header bg-primary text-white">Reset Password</div>
                <div className="card-body">
                  <form role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input type="password" className="form-control" id="newPassword"
                        name="data.newPassword"
                        value={this.state.data.newPassword}
                        onChange={this.handleInputChange}
                        aria-describedby="emailHelp" placeholder="Enter new Password" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">Confirm New Password</label>
                      <input type="password" className="form-control" id="confirmNewPassword"
                        name="data.confirmNewPassword"
                        value={this.state.data.confirmNewPassword}
                        onChange={this.handleInputChange}
                        aria-describedby="emailHelp" placeholder="Confirm new Password" required />
                    </div>
                    <div className="mx-auto">
                      <button type="submit" className="btn btn-primary">Update</button></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default privateRoute(ResetPassword);