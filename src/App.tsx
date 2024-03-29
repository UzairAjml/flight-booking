import React from 'react';
import MainLayout from './components/layout/MainLayout';
import "@egjs/react-flicking/dist/flicking.css";
import './App.scss';

const App: React.FC = () => {
  return <div className="mainDivColor">{<MainLayout />}</div>;
};

export default App;
