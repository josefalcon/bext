import React, { Component } from 'react';
import TabList from './tab-list';
import PlaybackController from './playback-controller';
import { SET_ACTIVE_TAB } from '../actions';
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

  render() {
    return (
      <div className="container">
        <TabList
          tabs={this.state.tabs}
          activeTab={this.state.activeTab}
          setActiveTab={this.setActiveTab.bind(this)} />
        <PlaybackController isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}

React.render(
  <App />,
  document.querySelector('body')
);
