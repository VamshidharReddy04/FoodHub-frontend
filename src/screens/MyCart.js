import React, { useState } from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { Link, useNavigate } from "react-router-dom";
import { addOrderForCurrentUser } from "../utils/userOrders";

export default function MyCart() {
  const cartState = useCart() || { cartItems: [] };
  const dispatch = useDispatchCart();
  const cartItems = Array.isArray(cartState.cartItems) ? cartState.cartItems : [];
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentRef, setPaymentRef] = useState("");
  const [customerName, setCustomerName] = useState(localStorage.getItem("userName") || "");
  const [customerPlace, setCustomerPlace] = useState("");
  const [showNoRefConfirm, setShowNoRefConfirm] = useState(false);
// Get unit price from item
  const getUnitPrice = (it) => {
    if (!it) return 0;
    if (typeof it.unitPrice === "number") return it.unitPrice;
    const options = Array.isArray(it.options) ? it.options : [];
    const priceObj = options.length > 0 && options[0] ? options[0] : {};
    if (priceObj.regular != null) return Number(priceObj.regular);
    const v = Object.values(priceObj).find(vv => !isNaN(Number(vv)));
    return v ? Number(v) : (it.price ? Number(it.price) : 0);
  };
// Handle quantity change
  const handleQtyChange = (item, desiredQty) => {
    desiredQty = Number(desiredQty);
    if (desiredQty <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id: item._id || item.id, size: item.size } });
      return;
    }
    dispatch({ type: "REMOVE_FROM_CART", payload: { id: item._id || item.id, size: item.size } });
    const payload = { ...item, qty: Number(desiredQty) };
    dispatch({ type: "ADD_TO_CART", payload });
  };
// Handle to remove item from cart
  const handleRemove = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id: item._id || item.id, size: item.size } });
  };
// Handle to clear entire cart
  const handleClear = () => {
    dispatch({ type: "CLEAR_CART" });
  };
// Calculate grand total
  const grandTotal = cartItems.reduce((sum, it) => {
    const unit = getUnitPrice(it);
    const q = Number(it.qty) || 0;
    return sum + unit * q;
  }, 0);
  // Use addOrderForCurrentUser so MyOrder and simulator work consistently
  const placeOrder = (method, ref) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }
    if (!customerName.trim() || !customerPlace.trim()) {
      alert("Please enter your Name and Place before placing the order.");
      return;
    }
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }
    const order = {
      id: `order_${Date.now()}`,
      customerName: customerName.trim(),
      customerPlace: customerPlace.trim(),
      items: cartItems,
      total: Number(grandTotal || 0),
      paymentMethod: method,
      paymentRef: ref || null,
      delivered: false,
      progress: 0,
      status: method === "cod" ? "Pending (COD)" : "Paid",
      createdAt: new Date().toISOString(),
    };
    // Save order to backend
    const ok = addOrderForCurrentUser(order);
    if (!ok) {
      alert("Failed to save order (not logged in).");
      return;
    }
    // clear cart and navigate — addOrderForCurrentUser dispatches ordersUpdated
    dispatch({ type: "CLEAR_CART" });
    navigate("/order");
  };
  return (
    <div className="container m-auto mt-5 table-responsive">
      <h3 className="mb-3">My Cart</h3>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">Cart is empty. <Link to="/">Go to Home</Link></div>
      ) : (
        <>
          <table className="table table-hover align-middle">
            <thead className="text-success fs-5">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th style={{ width: 160 }}>Quantity</th>
                <th>Price (unit)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((it, idx) => {
                const unit = getUnitPrice(it);
                const qty = Number(it.qty) || 0;
                const rowTotal = unit * qty;
                return (
                  <tr key={it._id || it.id || `${it.name}-${idx}`}>
                    <th scope="row">{idx + 1}</th>
                    <td>
                      <div className="d-flex align-items-center">
                        {it.img && (
                          <img src={it.img} alt={it.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} className="me-2"/>
                        )}
                        <div>
                          <div className="fw-semibold">{it.name}</div>
                          {it.size && <div className="text-muted small">Size: {it.size}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <select className="form-select" value={qty} onChange={(e) => handleQtyChange(it, Number(e.target.value))} style={{ width: 100 }}>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>₹{isNaN(unit) ? "0" : unit.toFixed(0)}</td>
                    <td>₹{isNaN(rowTotal) ? "0" : rowTotal.toFixed(0)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemove(it)}>Remove</button>
                    </td>
                  </tr>
                  );})}
            </tbody>
          </table>
          {/* Delivery details */}
          <div className="d-flex justify-content-between align-items-start mt-3 gap-3">
            <div style={{ minWidth: 320 }}>
              <h5>Delivery details</h5>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="mb-2">
                <label className="form-label">Place / Address</label>
                <input className="form-control" value={customerPlace} onChange={(e) => setCustomerPlace(e.target.value)} placeholder="Delivery place or address" />
              </div>
              <h5 className="mt-3">Payment</h5>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" id="cod" value="cod"
                  checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
              </div>
              <div className="form-check mt-2">
                <input className="form-check-input" type="radio" name="payment" id="online" value="online"
                  checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                <label className="form-check-label" htmlFor="online">Online Payment</label>
              </div>
              {paymentMethod === "online" && (
                <div className="mt-3">
                  <div className="mb-2">Payment reference (txn id / number)</div>
                  <input className="form-control" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Transaction ID or UTR" />
                  <div className="form-text">After completing payment, enter reference and click "Confirm Payment".</div>
                </div>
              )}
            </div>
            <div className="p-3 border rounded" style={{ minWidth: 260 }}>
              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Subtotal</div>
                <div className="fw-semibold">₹{isNaN(grandTotal) ? "0" : grandTotal.toFixed(0)}</div>
              </div>
              <div className="d-grid gap-2 mt-3">
                {paymentMethod === "cod" ? (
                  <button className="btn btn-primary" onClick={() => placeOrder("cod", null)}>
                    Place Order (Cash on Delivery)
                  </button>
                ) : (
                  <>
                    <button className="btn btn-success" onClick={() => {
                        if (!paymentRef) { setShowNoRefConfirm(true); return; }
                      placeOrder("online", paymentRef || `online_ref_${Date.now()}`);
                    }}>Confirm Payment & Place Order</button>
                    {showNoRefConfirm && (
                      <div className="modal-backdrop d-flex justify-content-center align-items-center" style={{ position: 'fixed', inset: 0, zIndex: 1050 }}>
                        <div className="card p-3" style={{ maxWidth: 420 }}>
                          <div className="card-body">
                            <h5 className="card-title">No payment reference</h5>
                            <p className="card-text">You did not enter a payment reference. Do you want to mark this order as paid anyway?</p>
                            <div className="d-flex justify-content-end gap-2">
                              <button className="btn btn-secondary" onClick={() => setShowNoRefConfirm(false)}>Cancel</button>
                              <button className="btn btn-primary" onClick={() => { placeOrder("online", `online_ref_${Date.now()}`);setShowNoRefConfirm(false);}}>Proceed</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </> )}
                <button className="btn btn-outline-danger" onClick={handleClear}>Clear Cart</button>
                <Link to="/" className="btn btn-outline-secondary">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}