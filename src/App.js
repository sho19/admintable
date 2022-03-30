import './App.css';
import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Table from './pages/table/table';
import Home from './pages/home/home';
import NotFound from './pages/notFound/notfound';

const App = () => (
  <Router>
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route exact path="/" element={<Home />} />
      <Route exact path="/display-users" element={<Table />} />
    </Routes>
  </Router>
);

export default App;
