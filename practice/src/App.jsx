import React from 'react'
import Navbar from './Navbar'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Invoices from './Invoices'
import Home from './Home'

const App = () => {
  return (
    <Router> 
      <Navbar/>
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/invoices" element = {<Invoices/>} />
      </Routes>
    </Router>
  )
}

export default App