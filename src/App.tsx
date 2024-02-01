import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function LoginLink() {
  const [link, setLink] = useState("")
  useEffect(() => {
    fetch("/auth/login", { "method": "GET" }).then(
      res => res.text()
    ).then(
      text => setLink(text)
    )
  }, [])
  return <a href={link}>Log in with Google</a>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LoginLink />
      </header>
    </div>
  );
}

export default App;
