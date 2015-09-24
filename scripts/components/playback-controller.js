import React, { Component } from 'react';

export default class PlaybackController extends Component {
  render() {
    return (
      <div className="controller">
        <ul>
          <li><i className="fa fa-step-backward"></i></li>
          <li><i className="fa fa-play"></i></li>
          <li><i className="fa fa-step-forward"></i></li>
        </ul>
      </div>
    );
  }
}
