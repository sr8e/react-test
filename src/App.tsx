import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Top } from './routes/top'
import { Login } from './routes/login'
import { MyPage } from './routes/mypage'
import { PaymentInputForm } from './routes/input';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/input" element={<PaymentInputForm />} />
      </Routes>
    </div>
  );
}

export default App;
