import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RoutesComponent from './routes';

const App = () => {
  return (
    <Router>
      <Header />
      <RoutesComponent />
      <Footer />
    </Router>
  );
};

export default App;