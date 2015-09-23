import React from 'react';
import TabList from './components/tab-list';
import { get } from './store';

get()
  .then(state => {
    console.log('state', state);
    React.render(
      <TabList tabs={state.tabs} activeTab={state.activeTab}/>,
      document.querySelector('.container')
    );
  });
