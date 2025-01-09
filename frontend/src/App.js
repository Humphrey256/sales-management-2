import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SalesFormPage from './pages/SalesFormPage';
import SalesListPage from './pages/SalesListPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/SalesFormPage" element={<SalesFormPage />} />
          <Route path="/SalesListPage" element={<SalesListPage />} />
          <Route path="/SalesFormPage/:id" element={<SalesFormPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
