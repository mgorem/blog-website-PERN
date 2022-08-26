import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [hello, setHello] = useState(null)

  useEffect(() => {
    axios.get('/hello').then((response) => {
    console.log(response.data);  
    setHello(response.data)
    })
    .catch(err => console.log(err))
  }, []);

  return (
    <div className="App">
      {hello ? <div>{hello}</div> : null}
    </div>
  );
}

export default App;
