import React, { useState } from 'react'

const data = [
    { id: 1, itemname: "laptop", quanity: 2, price:3000, amount:12341},
    { id: 2, itemname: "random", quanity: 34, price:33456, amount:123477},
    { id: 3, itemname: "sample", quanity: 29, price:111, amount:9087},
]
const Invoices = () => {
    const [invoices, setInvoices] = useState(data);
    const [newInvoice, setNewInvoice] = useState({
        itemname: "",
        quanity: 0,
        price: 0,
        amount: 0,
    })

    const [editIndex, setEditindex] = useState(-1);

    const addinvoice = () =>{
        if (newInvoice.itemname === "") return alert("item name cant be null")
        const updatedInvoices = [
    ...invoices, { ...newInvoice, id:invoices.length+1}];
    setInvoices(updatedInvoices);
    resetform();
    }

    const updateInvoice = () => {
        const updatedInvoices = invoices.map((invoice, index) => 
        index === editIndex ? {...invoice, ...newInvoice} : invoice
        );
        setInvoices(updatedInvoices)
        resetform();
        setEditindex(-1);
    }

    const deleteInvoice = (id) =>{
        const updatedInvoices = invoices.filter((invoice) => invoice.id != id);
        setNewInvoice(updatedInvoices);
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setNewInvoice({...newInvoice, [name]: value})
    }

    const editInvoice = (index) =>{
        setNewInvoice(invoices[index]);
        setEditindex(index)
    }

    const resetform = () => {
        setNewInvoice({itemname: "", quanity: 0, price: 0, amount: 0})
    }
  return (
    <div className='m-2'>
        INVOICES
        <div>
            <input type='text' name="itemname" placeholder='item name' value={newInvoice.itemname} onChange={handleChange} />
            <input type='number' name="quantity" placeholder='quantity' value={newInvoice.quantity} onChange={handleChange} />
            <input type='text' name="price" placeholder='price' value={newInvoice.price} onChange={handleChange} />
            <input type='text' name="amount" placeholder='item amount' value={newInvoice.amount} onChange={handleChange} />
            {
                editIndex >= 0 ? (
                    <button onClick={updateInvoice} className='bg-red-300'>update Invoice</button>
                ): (
                    <button onClick={addinvoice} className='bg-green-200'>add invoice</button>
                )
            }
            <button onClick={resetform} className='ml-2 bg-blue-600'>  reset </button>
        </div>
        {/* table */}
        <table border='1' cellPadding="10" cellSpacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Item name</th>
                    <th>quantity</th>
                    <th>price</th>
                    <th>amount</th>
                    <th>ID</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => (
                    <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>{invoice.itemname}</td>
                        <td>{invoice.quanity}</td>
                        <td>{invoice.price}</td>
                        <td>{invoice.amount}</td>
                        <td>
                            <button onClick={ ()=> editInvoice(index)}>Edit</button>
                            <button onClick={()=> deleteInvoice(invoice.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>

    </div>
  )
}

export default Invoices