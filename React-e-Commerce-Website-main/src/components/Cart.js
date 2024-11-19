// Cart component containing the min cart page / checkout page

import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { CartState } from '../context/CartContext';
import Rating from './Rating';
import Form from 'react-bootstrap/Form';
import { AiFillDelete } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContextProvider';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const Cart = () => {
  const notifySuccess = (message) => //success notification on adding / removing product from the cart 
    toast.success(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true
    });
  ;
  const notifyError = (message) =>
    toast.error(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true
    });
  ;
  const { theme } = useTheme();
  const {
    state: { cart },
    dispatch,
    productFilterState: { searchQuery }
  } = CartState();

  const [total, setTotal] = useState(); //for the subtotal
  const [items, setItems] = useState(cart.length);

  // when cart items will get changed this will get executed, calculating the subtotal
  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, curr) => acc + Number(curr.price) * curr.qty, //function
        0 //initial val
      )
    );
    setItems(
      cart.reduce(
        (acc, curr) => acc + Number(curr.qty),
        0
      )
    );
  }, [cart]);

  const transformedProducts = () => {
    let products = cart;
    if (searchQuery) {
      products = products.filter(prod => prod.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return products;
  }
  const removeCart = async (id, prod) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/order/deleteOrder/${id}`);
      if (response) {
        dispatch({ //passes type and payload
          type: 'REMOVE_FROM_CART',
          payload: prod //product that is currently being rendered
        });
        notifySuccess('Item removed successfully');
      }
    } catch (error) {
      console.log(error);
      notifyError(error);
    }
  }

  return (
    <div className='home flex-column'>
      <div className={`productContainer ms-0 ${theme === 'dark' && 'darkBody'}`}>
        <ListGroup>
          {
            transformedProducts().map(prod => (
              <ListGroup.Item key={prod.id}>
                <Row>
                  <Col md={2}>
                    <Image src={prod.image} alt={prod.name} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <span>{prod.name}</span>
                  </Col>
                  <Col md={2}>$ {prod.price}</Col>
                  <Col md={2}>
                    <Rating rating={prod.ratings}></Rating>
                  </Col>
                  <Col md={2}>
                    <Form.Select
                      value={prod.qty}
                      onChange={e => dispatch({
                        type: 'CHANGE_CART_QTY',
                        payload: {
                          id: prod.id,
                          qty: e.target.value,
                        },
                      })}
                    >
                      {[...Array(prod.inStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeCart(prod.id, prod)}
                    >
                      <AiFillDelete fontSize='20px' />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      </div>
      {
        cart.length > 0 ?
          <div className='checkoutCard'>
            <Card>
              <Card.Body>
                <Card.Title> SUBTOTAL: ${total && total.toFixed(2)}</Card.Title>
                <Card.Text>
                  Total items: {items}
                </Card.Text>
                <Link to='/checkout' state={total}>
                  <Button variant="primary">Proceed to Checkout</Button>
                </Link>
              </Card.Body>
            </Card>
          </div> :
          <h4 style={{ textAlign: 'center' }}>Cart is Empty!</h4>
      }
    </div>
  )
}

export default Cart
