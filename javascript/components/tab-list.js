import React, { Component, PropTypes } from 'react';
import { SET_ACTIVE_TAB } from '../actions';
import { dispatch } from '../store';

class TabItem extends Component {
  render() {
    let selected = this.props.active
      ? <i className="fa fa-check"></i>
      : null;

    return (
      <li key={this.props.id} onClick={this.props.setActiveTab}>
        {selected} {this.props.title}
      </li>
    );
  }
}

export default class TabList extends Component {
  constructor(props) {
    super(props);
    this.state = {activeTab: props.activeTab};
  }

  setActiveTab(tabId) {
    dispatch({type: SET_ACTIVE_TAB, tabId: tabId});
    this.setState({activeTab: tabId});
  }

  render() {
    let tabs = Object.keys(this.props.tabs);
    return (
      <div className="tab-list">
        <ul>
          { tabs.map(t => <TabItem id={t}
                            title={this.props.tabs[t].title}
                            active={this.state.activeTab === t}
                            setActiveTab={e => this.setActiveTab(t)}
                          />) }
        </ul>
      </div>
    );
  }
}
