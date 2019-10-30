// IMPORTS
import React, { Component } from 'react';
import styled from 'styled-components'
import axios from "axios";
import { headingDistanceTo } from "geolocation-utils"

// COMPONENTS
import NetworkModal from '../NetworkSpeed/networkModal';
import NetworkSpeed from '../NetworkSpeed/NetworkSpeed';

import TextArea from "../Review/TextArea";
import Select from "../Review/Select";
import Button from "../Review/Button";
import { withFirebase } from '../../Firebase';



// STYLES
const buttonStyle = {
  margin: "10px 10px 10px 10px",
};

// STYLED COMPONENTS
const StyleModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  font-size: 12px;
`
const Header = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  
  color: #FBD702;
  width: 100%;
  margin-bottom: 15px;
`
const STYLED_form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin: 5px 0 5px 0;
  .buttonContainer {
    display: flex;
    justify-content: center;
  }
  border-radius: 10px 10px 10px 10px;
  background-color: white;

// import Firebase from './firebase';
const buttonStyle = {
  margin: "10px 10px 10px 10px"
};`


class ReviewPanel1 extends Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      newUser: {
        user_id: null,
        rating: " ",
        internet_rating: " ",
        comments: ''
      },
      rating: ["1", "2", "3"],
      internet_rating: ["1", "2", "3"],
      uid: this.props.firebase.auth.currentUser.uid,
      submitted: false,
      network: false
    };

    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }


  // COMPONENT
  componentDidMount() {

    axios
      .get(`https://wheretocode-master.herokuapp.com/users/${this.state.uid}`)
      .then(user => {
        let currentUserId = {
          user_id: user.data[0].id,
          rating: null,
          internet_rating: null,
          comments: ''
        }
        this.setState({
          newUser: currentUserId
        })
      }

      )
      .catch(error => {
        console.log(error);
      })

  }

  // METHODS
  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;


    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          [name]: value
        }
      }),
    );
  }

  handleTextArea(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          comments: value
        }
      }),
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.newUser;
    console.log(this.state.newUser);
    axios
      .post("https://wheretocode-master.herokuapp.com/reviews", userData)
      .then(response => {
        console.log("res", response)
      })
      .then(res => {
        this.setState({ submitted: true })
      })

      .catch(error => {
        console.log(error);
      })
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        user_id: '',
        rating: '',
        comments: '',
        internet_rating: ''
      }
    });
  }

  toggleNetworkTest = () => {
    this.setState(prevState => {
      return { ...prevState, network: !prevState.network }
    })
  }


  render() {
    //console.log(this.props.coords.lat(), this.props.coords.lng())
    const locationCoords = [ ...this.props.coords ];
    const userCoords = [ Number(localStorage.getItem('lat')), Number(localStorage.getItem('lng')) ]
    // console.log('*******',  userCoords, locationCoords, 'asd')
    // console.log(`****** ${headingDistanceTo(userCoords, locationCoords).distance * 0.000621}miles`)
    return (
      <>
        {(this.state.submitted ? <StyleModal><Header>Thank You For Submitting A Review</Header></StyleModal> :
          <StyleModal>
            <Header> Leave a Review </Header>

            <div style={{display: "flex"}}>
            <STYLED_form form onSubmit={this.handleFormSubmit}>


              {/* Rating Required*/}
              <Select
                title={"Location Rating"}
                name={'rating'}
                options={this.state.rating}
                value={this.state.newUser.rating}
                placeholder={"Select Rating"}
                handleChange={this.handleInput}
              />
              {/*Internet Rating */}
              <Select
                title={"Interet Rating"}
                name={'internet_rating'}
                options={this.state.internet_rating}
                value={this.state.newUser.internet_rating}
                placeholder={"Select Internet Rating"}
                handleChange={this.handleInput}
              />
              {/*Comment */}
              <TextArea
                title={"Comments"}
                rows={10}
                value={this.state.newUser.comments}
                name={'comment'}
                handleChange={this.handleTextArea}
                placeholder={"Leave a comment"}
              />
              {/*Submit */}
              <div className='buttonContainer'>
                <Button
                  action={this.handleFormSubmit}
                  type={"primary"}
                  title={"Submit"}
                  style={buttonStyle}
                />
                {/* Clear form */}
                <Button
                  action={this.handleClearForm}
                  type={"secondary"}
                  title={"Clear"}
                  style={buttonStyle}
                />
              </div>
            </STYLED_form>

            {
              this.state.network ? <NetworkSpeed /> 
                                       : null
            }
            </div>
            <NetworkModal handleNetwork={this.toggleNetworkTest}
                          runTest={this.state.network}
            />
          </StyleModal>

        )}
      </>
    );
  }
}

const ReviewPanel = withFirebase(ReviewPanel1);
export { ReviewPanel };

