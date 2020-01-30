import React from 'react';
import ContainerComponent from './components/container.component';
import { Provider } from 'react-redux';
import store from './redux/store';

function Start() {
  return (
    <Provider store={store}>
      <div className="app">
        <div className="header">Goal</div>
        <ContainerComponent />  
      </div>
    </Provider>
  );
}

export default Start;
