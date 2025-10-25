import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrdersForCurrentUser, saveOrdersForCurrentUser, startSimulationsForAll, removeUndeliveredOrdersForCurrentUser, stopSimulationForOrder } from "../utils/userOrders";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState({ type: null, target: null, loading: false });
// Load orders
  useEffect(() => {
    // load per-user orders
    setOrders(getOrdersForCurrentUser());
    // resume background progress for unfinished orders
    startSimulationsForAll();
// Update the order
    const onUpdated = () => setOrders(getOrdersForCurrentUser());
    window.addEventListener("ordersUpdated", onUpdated);
    window.addEventListener("storage", onUpdated);
    return () => {
      window.removeEventListener("ordersUpdated", onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, []);

  const toggleDetails = (id) => setExpanded(prev => (prev === id ? null : id));
  const confirmReceived = (orderId) => {
    const updated = (orders || []).map(o =>
      o.id === orderId ? { ...o, delivered: true, status: "Delivered complete", progress: 100 } : o
    );
    saveOrdersForCurrentUser(updated);
    setOrders(updated);
  };
// Cancel or remove order
  const promptCancel = (orderId) => setModal({ type: "cancel", target: orderId, loading: false });
  const promptRemovePending = () => setModal({ type: "removePending", target: null, loading: false });
  const closeModal = () => setModal({ type: null, target: null, loading: false });
// Handle confrom
  const handleModalConfirm = async () => {
    if (!modal.type) return;
    setModal(m => ({ ...m, loading: true }));
    try {
      if (modal.type === "removePending") {
        removeUndeliveredOrdersForCurrentUser();
        setOrders(getOrdersForCurrentUser());
      } else if (modal.type === "cancel" && modal.target) {
        // remove single order and stop simulation
        const existing = getOrdersForCurrentUser() || [];
        const updated = existing.filter(o => o.id !== modal.target);
        stopSimulationForOrder(modal.target);
        saveOrdersForCurrentUser(updated);
        setOrders(updated);
      }
    } finally {
      closeModal();
    }
  };

  const getUnitPrice = (it) => {
    if (!it) return 0;
    if (typeof it.unitPrice === "number") return it.unitPrice;
    const opts = Array.isArray(it.options) ? it.options : [];
    const priceObj = opts.length > 0 && opts[0] ? opts[0] : {};
    const v = Object.values(priceObj).find(vv => !isNaN(Number(vv)));
    return v ? Number(v) : (it.price ? Number(it.price) : 0);
  };

  const totalOrders = orders.length;
  const totalAmount = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  if (totalOrders === 0) {
    return (
      <div className="container mt-5">
        <h3>My Orders (0)</h3>
        <div className="alert alert-info">No orders yet. <Link to="/">Shop now</Link></div>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3>My Orders <small className="text-muted">({totalOrders})</small></h3>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-danger" onClick={promptRemovePending}>Remove Pending Orders</button>
          <Link to="/" className="btn btn-outline-secondary">Continue Shopping</Link>
        </div>
      </div>

      {orders.map(o => (
        <div className="card mb-3" key={o.id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <div className="d-flex align-items-baseline gap-3">
                  <h5 className="card-title mb-0">Order {o.id}</h5>
                  <small className="text-muted">• {new Date(o.createdAt).toLocaleString()}</small>
                </div>
                <div className="small text-muted mt-1">Customer: <strong>{o.customerName}</strong> • Place: <strong>{o.customerPlace}</strong></div>
                <div className="mt-2">Status: <strong>{o.status || "Unknown"}</strong></div>
              </div>
              <div className="text-end">
                <div className="fs-4 fw-bold">₹{isNaN(o.total) ? "0" : o.total.toFixed(0)}</div>
                <div className="small text-muted">Items: {Array.isArray(o.items) ? o.items.length : 0}</div>
              </div>
            </div>
            <hr />
            <div className="mb-2">
              <div className="mb-1">Delivery Progress</div>
              <div className="progress" style={{ height: 16 }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${Math.min(100, Number(o.progress || 0))}%` }} aria-valuenow={o.progress || 0} aria-valuemin="0" aria-valuemax="100" > {Math.min(100, Number(o.progress || 0))}% </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => toggleDetails(o.id)}>
                  {expanded === o.id ? "Hide Details" : "View Order"} </button>
                {!o.delivered && o.progress >= 100 && (
                  <button className="btn btn-sm btn-success me-2" onClick={() => confirmReceived(o.id)}>Confirm Received</button>)}
                {!o.delivered && o.status !== "Cancelled" && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => promptCancel(o.id)}>Cancel Order</button>)}
              </div>
              <div>{o.delivered ? <span className="badge bg-success">Delivered</span>
                  : o.status === "Cancelled" ? <span className="badge bg-secondary">Cancelled</span>
                  : <span className="badge bg-info">{o.status || "In Progress"}</span>}
              </div>
            </div>
            {expanded === o.id && (
              <>
                <hr />
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead className="text-secondary small">
                      <tr>
                        <th>#</th> <th>Product</th> <th style={{ width: 140 }}>Quantity</th> <th>Unit</th> <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(o.items || []).map((it, idx) => {
                        const unit = getUnitPrice(it);
                        const qty = Number(it.qty) || 0;
                        return (
                          <tr key={it._id || `${it.name}-${idx}`}>
                            <th scope="row">{idx + 1}</th>
                            <td>
                              <div className="d-flex align-items-center">
                                {it.img && <img src={it.img} alt={it.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} className="me-2" />}
                                <div>
                                  <div className="fw-semibold">{it.name}</div>
                                  {it.size && <div className="small text-muted">Size: {it.size}</div>}
                                </div>
                              </div>
                            </td>
                            <td>{qty}</td>
                            <td>₹{isNaN(unit) ? "0" : unit.toFixed(0)}</td>
                            <td>₹{(unit * qty).toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="card mt-4 mb-5">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <div className="small text-muted">Total orders</div>
            <div className="fs-4 fw-bold">{totalOrders}</div>
          </div>
          <div>
            <div className="small text-muted">Total amount</div>
            <div className="fs-4 fw-bold">₹{isNaN(totalAmount) ? "0" : totalAmount.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {modal.type && (
        <div role="dialog" aria-modal="true" className="modal-backdrop d-flex justify-content-center align-items-center" style={{ position: "fixed", inset: 0, zIndex: 1050 }}>
          <div className="card p-3" style={{ maxWidth: 520 }}>
            <div className="card-body">
              <h5 className="card-title">{modal.type === "removePending" ? "Remove pending orders?" : "Cancel order?"}</h5>
              <p className="card-text">
                {modal.type === "removePending"
                  ? "Permanently remove all orders that are not yet delivered. This cannot be undone."
                  : "This will permanently remove the selected order if it is not delivered. Proceed?"}
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={closeModal} disabled={modal.loading}>Cancel</button>
                <button className="btn btn-danger" onClick={handleModalConfirm} disabled={modal.loading}>
                  {modal.loading ? "Processing..." : (modal.type === "removePending" ? "Remove Pending" : "Yes, Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}