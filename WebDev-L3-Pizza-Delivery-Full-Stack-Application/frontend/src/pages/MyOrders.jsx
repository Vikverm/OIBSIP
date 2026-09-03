import React, { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import OrderTimeline from "../components/OrderTimeline";

export default function MyOrders() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { try { const { data } = await api.get("/orders/mine"); setOrders(data); setError(""); } catch (e) { setError(e.response?.data?.message || "Unable to load orders."); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [load]);
  return <main className="page-shell"><div className="page-heading"><div><span className="eyebrow">ORDER HISTORY</span><h1>My Orders</h1><p>Order status refreshes automatically every few seconds.</p></div><button className="outline-btn" onClick={load}>↻ Refresh</button></div>
    {error && <div className="error-message">{error}</div>}
    {loading ? <div className="loading-card">Loading your orders…</div> : orders.length === 0 ? <div className="empty-state">🍕<h2>No orders yet</h2><p>Build your perfect pizza and place your first order.</p></div> : <div className="orders-list">{orders.map(o => <article className="order-card" key={o._id}><div className="order-card-head"><div><h3>Order #{o._id.slice(-6).toUpperCase()}</h3><small>{new Date(o.createdAt).toLocaleString()}</small></div><span className={`payment-pill ${o.paymentStatus}`}>{o.paymentStatus}</span></div><div className="order-details"><div><span>Pizza</span><b>{o.pizza?.base} • {o.pizza?.sauce} • {o.pizza?.cheese}</b></div><div><span>Vegetables</span><b>{o.pizza?.vegetables?.length ? o.pizza.vegetables.join(", ") : "None"}</b></div><div><span>Delivery</span><b>{o.address}</b></div><div><span>Total</span><b>₹{Number(o.total).toLocaleString("en-IN")}</b></div></div>{o.paymentStatus === "paid" && <OrderTimeline currentStatus={o.status}/>}</article>)}</div>}
  </main>;
}
