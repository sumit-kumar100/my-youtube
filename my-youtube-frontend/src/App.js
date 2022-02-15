import Navbar from './pages/Navbar';
import MyRoutes from './MyRoutes';
import SweetAlert from 'react-bootstrap-sweetalert';
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Offline } from "react-detect-offline";
import axios from 'axios'



class App extends Component {

  state = {
    loading: true,
    offline: false
  }

  componentDidMount() {

    axios.get("https://cors-anywhere.herokuapp.com/https://www.zomato.com/webroutes/getPage?page_url=/ncr/dashi-dimsum-sushi-bar-new-friends-colony-new-delhi/order&location=&isMobile=0")
      .then(res => {
        console.log(res)
      })
      .catch(error => console.log(error));
  }

  onConfirm = () => {
    this.setState({ offline: true })
  }

  render() {

    return (
      <Router>
        <div className='flyout'>
          <Navbar />
          <main >
            <MyRoutes />
            <Offline>
              <SweetAlert
                title={<span>Uh oh!</span>}
                onConfirm={this.onConfirm}
              >
                <span>You are now offline.
                  Please check your internet connection.</span>
              </SweetAlert>
            </Offline>
          </main>
        </div>
      </Router>
    );

  }
}


export default App;