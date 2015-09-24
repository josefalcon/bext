import React, { Component } from 'react';

export default class PlaybackController extends Component {
  render() {
    let toggle = this.props.isPlaying
      ? <i className="fa fa-pause"></i>
      : <i className="fa fa-play"></i>;

    return (
      <div className="controller">
        <ul>
          <li><i className="fa fa-step-backward"></i></li>
          <li>{toggle}</li>
          <li><i className="fa fa-step-forward"></i></li>
        </ul>
      </div>
    );
  }
}
