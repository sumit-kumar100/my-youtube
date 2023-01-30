import React, { Component } from "react";
import FadeIn from "react-fade-in";
import ScaleLoader from "react-spinners/ScaleLoader";

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
        </FadeIn>
      </>
    );
  }
}
export default Loading;
