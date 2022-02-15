import React, { Component } from "react";
import FadeIn from "react-fade-in";
import ScaleLoader from "react-spinners/ScaleLoader";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Offline } from "react-detect-offline";

class Loading extends Component {
  state = {
    offline: true
  }

  onConfirm = () => {
    this.setState({ offline: false })
  }

  render() {
    return (
      <>
        <FadeIn>
          <div className="d-flex justify-content-center align-items-center loading-gif">
            <ScaleLoader color={'red'} loading={true} size={300} />
          </div>
          {
            this.state.offline ?
              <Offline>
                <SweetAlert
                  title={<span>Uh oh!</span>}
                  onConfirm={this.onConfirm}
                >
                  <span>You are now offline.
                    Please check your internet connection.</span>
                </SweetAlert>
              </Offline>
              :
              ("")
          }
        </FadeIn>
      </>
    );
  }
}
export default Loading;
