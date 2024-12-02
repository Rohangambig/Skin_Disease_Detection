import React, { useEffect, useState } from "react";
import './index.css';
import axios from 'axios';

const Index = () => {
    const [cartData, setCartData] = useState([]); // Initialize with an empty array
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:2463/medicines/fetchCart', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        Role: localStorage.getItem('role'),
                    },
                });
                setCartData(response.data);
            } catch (err) {
                console.error('Error in fetching cart data:', err);
                setError('Failed to fetch cart data.');
            }
        };

        fetchMedicines();
    }, [cartData]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    const handleRemoveCart = async (id) => {
        try {
            const response = await axios.post('http://localhost:2463/medicines/removeCart',{id},{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Role: localStorage.getItem('role'),
                },
            });
            
        }catch(err) {
            console.log("Error in removing the cart...",err);
        }
    }

    return (
        <div>
            <h1 className="cart-headings">Cart Page</h1>  
            {cartData.length > 0 ? (
                <ul className="medicine-list">
                    
                    {cartData.map((item, index) => (
                        <li key={index} className="medicine-item">
                            <button onClick={()=>{handleRemoveCart(item._id)}} id="remove-cart-button">Remove</button>
                            <img
                                src={item.photo}
                                alt={`Medicine for ${item.disease}`}
                                className="medicine-photo"
                            />
                            <h3>Disease: {item.disease}</h3>
                            <h5>Medicine Name: {item.medicine_name}</h5>
                            <p id="p-last-child">{item.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p id="p-last-child">No medicines found in your cart.</p>
            )}
        </div>
    );
};

export default Index;
