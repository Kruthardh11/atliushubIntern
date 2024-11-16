import React from 'react'
import {Link} from "react-router-dom"


const Navbar = () => {
  return (
    <div className='bg-blue-200 flex  p-6'>
        <nav >
            
                <Link to="/" className='mr-4'>Home</Link>
            
            
                
                <Link to="/invoices">Invoices</Link>
               
        </nav>
    </div>
  )
}

export default Navbar