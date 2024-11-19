import React, { useRef, useState } from 'react';
import './checkoutStyles.css';
import emailjs from "emailjs-com";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTheme } from '../context/ThemeContextProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartState } from '../context/CartContext';
import TestCards from './TestCards';
import axios from 'axios';

const CheckoutForm = () => {

  const EMAILJS_SERVICE_ID = "service_rs1um8s"
  const EMAILJS_TEMPLATE_ID = "template_w0w2wnj"
  const EMAILJS_PUBLIC_KEY = "EqH95WQfdxnnRVXlo"
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const referenceNo = Math.floor(Math.random() * 900000) + 100000;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const location = useLocation();
  const grandtotal = location.state ? location.state : 0;
  const date = new Date();

  const { theme } = useTheme();

  const container = useRef();

  const navigate = useNavigate();

  const { dispatch } = CartState();

  const resetOrder = async () => {
    try {
      const response = await axios.delete("http://localhost:5000/api/order/reset")
      if (response) {
        dispatch({
          type: 'EMPTY_CART',

        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (elements == null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      const { id } = paymentMethod;
      console.log(id);
      setError(null);
      setProcessing(false);
      container.current.innerHTML = `<h2>Payment succeeded</h2>`;
      resetOrder()
      sendEmail();
    }
  };

  const sendEmail = () => {
    const emailParams = {
      to_email: email,
      name: name,
      ref_no: referenceNo,
      order_date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      total: `$ ${grandtotal} `
    };

    console.log("Sending email with params: ", emailParams);

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams,
      EMAILJS_PUBLIC_KEY
    )
      .then(
        result => {
          console.log("Email sent successfully: ", result);
          alert('Thanks for being a good customer! Check your email for the invoice');
          navigate('/');
        },
        error => {
          console.error("EmailJS Error: ", error);
          alert("The email wasn't sent due to an issue that occurred, but your command was still executed successfully.");
        }
      );
  };

  return (
    <div className='checkoutPage' ref={container}>
      <TestCards />
      <form className='checkoutForm'>
        <div className="form-row">
          <label style={{ color: theme === 'light' ? 'black' : 'white' }}>Name</label>
          <input className='cardInput' type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-row">
          <label htmlFor="card-element" style={{ color: theme === 'light' ? 'black' : 'white' }}>
            Card information
          </label>
          <div id="cardElement">
            <CardElement />
          </div>
          {error && <div className="card-error" role="alert">{error}</div>}
        </div>
        <div className="form-row">
          <label style={{ color: theme === 'light' ? 'black' : 'white' }}>Email</label>
          <input className='cardInput' type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button
          type="submit"
          disabled={processing}
          onClick={handleSubmit}
        >
          {processing ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;