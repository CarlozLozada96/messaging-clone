import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/SignIn'; 
import Register from './components/auth/SignUp';
import { ChatContextProvider } from './components/context/ChatContext';
import { AuthContextProvider } from './components/context/AuthContext';
import { SelectionProvider } from './components/context/SelectionContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<SelectionProvider>
<AuthContextProvider>
  <ChatContextProvider>
  <React.StrictMode>
    <Router>
      <Routes> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<App />} /> 
      </Routes> 
    </Router>
  </React.StrictMode>
  </ChatContextProvider>
  </AuthContextProvider>
</SelectionProvider>
);