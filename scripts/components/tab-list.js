import React, { Component } from 'react';
import classnames from 'classnames';

class TabItem extends Component {
  render() {
    let className = this.props.active ? 'active' : '';
    return (
      <li className={className} onClick={this.props.setActiveTab}>
        <div className="title">{this.props.tab.title}</div>
        <i className={classnames("fa fa-volume-up", {audible: this.props.tab.audible})}></i>
      </li>
    );
  }
}

export default class TabList extends Component {
  render() {
    let tabs = Object.keys(this.props.tabs);
    return (
      <div className="tab-list">
        <ul>
          { tabs.map(t => <TabItem
                            key={t}
                            tab={this.props.tabs[t]}
                            active={this.props.activeTab === t}
                            setActiveTab={e => this.props.setActiveTab(t)} />) }
        </ul>
      </div>
    );
  }
}
