import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';


function App() {
  return (
    <BrowserRouter>
      
      <div className='App'>
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="/otherpage">to Other Page</Link>
        </header>

          <Routes>
            <Route index element={<Fib />} />
            <Route exact path="/" element={<Fib />} />
            <Route exact path="/otherpage" element={<OtherPage/>} />
          </Routes>
      </div>
       
        
      
    </BrowserRouter>
  );
}

export default App;
