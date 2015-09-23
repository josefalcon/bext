import React, { Component } from 'react';
import TabList from './components/tab-list';
import { SET_ACTIVE_TAB } from './actions';
import { getState, subscribe, unsubscribe, dispatch } from './store';

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
      <TabList
        tabs={this.state.tabs}
        activeTab={this.state.activeTab}
        setActiveTab={this.setActiveTab.bind(this)} />
    );
  }
}

React.render(
  <App />,
  document.querySelector('.container')
);
