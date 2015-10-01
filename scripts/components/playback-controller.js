import React, { Component } from 'react';

export default class PlaybackController extends Component {
  render() {
    if (!this.props.hasTabs) return null;

    let toggle = this.props.isPlaying
      ? <i className="fa fa-pause"></i>
      : <i className="fa fa-play"></i>;

    return (
      <div className="controller">
        <ul>
          <li onClick={this.props.previousTrack}><i className="fa fa-step-backward"></i></li>
          <li onClick={this.props.toggleTrack}>{toggle}</li>
          <li onClick={this.props.nextTrack}><i className="fa fa-step-forward"></i></li>
        </ul>
      </div>
    );
  }
}
