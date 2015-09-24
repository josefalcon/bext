import React, { Component } from 'react';

class TabItem extends Component {
  render() {
    let className = this.props.active ? 'active' : '';
    return (
      <li className={className} onClick={this.props.setActiveTab}>
        {this.props.title}
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
                            title={this.props.tabs[t].title}
                            active={this.props.activeTab === t}
                            setActiveTab={e => this.props.setActiveTab(t)} />) }
        </ul>
      </div>
    );
  }
}
