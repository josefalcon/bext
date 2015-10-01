import React, { Component } from 'react';
import TabList from './tab-list';
import PlaybackController from './playback-controller';
import { SET_ACTIVE_TAB, TOGGLE_TRACK, PREV_TRACK, NEXT_TRACK } from '../actions';
import { getState, subscribe, unsubscribe, dispatch } from '../store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeTab: -1, tabs: {}};
  }

  componentDidMount() {
    getState()
      .then(state => {
        this.setState(state);
      });
    subscribe(this.setState.bind(this));
  }

  setActiveTab(tabId) {
    dispatch({type: SET_ACTIVE_TAB, tabId: tabId});
  }

  toggleTrack() {
    dispatch({type: TOGGLE_TRACK});
  }

  previousTrack() {
    dispatch({type: PREV_TRACK});
  }

  nextTrack() {
    dispatch({type: NEXT_TRACK});
  }

  render() {
    let hasTabs = this.props.tabs && Object.keys(this.props.tabs).length > 0;
    return (
      <div className="container">
        <TabList
          tabs={this.state.tabs}
          activeTab={this.state.activeTab}
          setActiveTab={this.setActiveTab.bind(this)} />

        <PlaybackController
          hasTabs={hasTabs}
          isPlaying={this.state.isPlaying}
          toggleTrack={this.toggleTrack.bind(this)}
          previousTrack={this.previousTrack.bind(this)}
          nextTrack={this.nextTrack.bind(this)} />
      </div>
    );
  }
}

React.render(
  <App />,
  document.querySelector('body')
);
