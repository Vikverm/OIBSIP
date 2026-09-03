import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Summary() {
  const navigate = useNavigate(); const { user } = useAuth();
  const [pizza, setPizza] = useState(null); const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [testEnabled, setTestEnabled] = useState(false);
  useEffect(() => { try { setPizza(JSON.parse(localStorage.getItem("selectedPizza") || "null")); } catch { setError("Unable to load your pizza."); } setTestEnabled(import.meta.env.VITE_ENABLE_TEST_PAYMENT === "true"); }, []);

  const loadRazorpay = () => new Promise(resolve => { if (window.Razorpay) return resolve(true); const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = () => resolve(true); s.onerror = () => resolve(false); document.body.appendChild(s); });

  const createOrder = async () => {
    if (!pizza || !address.trim()) throw new Error("Please enter your delivery address.");
    const { data } = await api.post("/orders", { pizza: { base: pizza.base.name, sauce: pizza.sauce.name, cheese: pizza.cheese.name, vegetables: pizza.vegetables.map(v => v.name), price: pizza.total }, total: pizza.total, address });
    return data;
  };

  const testSuccess = async () => {
    try { setLoading(true); setError(""); const order = await createOrder(); await api.post("/payments/test-success", { orderId: order._id }); localStorage.removeItem("selectedPizza"); navigate("/orders"); }
    catch (e) { setError(e.response?.data?.message || e.message || "Test payment failed."); } finally { setLoading(false); }
  };

  const pay = async () => {
    try {
      setLoading(true); setError(""); const ok = await loadRazorpay(); if (!ok) throw new Error("Unable to load Razorpay checkout.");
      const order = await createOrder(); const { data } = await api.post(`/payments/${order._id}/create`);
      const options = { key: data.key, amount: data.razorpayOrder.amount, currency: data.razorpayOrder.currency, name: "PizzaFlow", description: "Custom Pizza Order", order_id: data.razorpayOrder.id, prefill: { name: user?.name || "", email: user?.email || "" }, theme: { color: "#ff4d1f" }, handler: async response => {
        try { await api.post("/payments/verify", { orderId: order._id, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature }); localStorage.removeItem("selectedPizza"); navigate("/orders"); }
        catch (e) { setError(e.response?.data?.message || "Payment verification failed."); }
        finally { setLoading(false); }
      }, modal: { ondismiss: () => setLoading(false) } };
      new window.Razorpay(options).open();
    } catch (e) { setError(e.response?.data?.message || e.message || "Unable to start payment."); setLoading(false); }
  };

  if (!pizza) return <main className="page-shell"><div className="empty-state"><h2>No Pizza Selected 🍕</h2><p>Please build your pizza first.</p><button onClick={() => navigate("/builder")}>Build Pizza</button></div></main>;
  return <main className="page-shell summary-layout"><section className="summary-main"><span className="eyebrow">CHECKOUT</span><h1>Order Summary</h1><p>Review your pizza and delivery details before payment.</p>{error && <div className="error-message">{error}</div>}
    <div className="summary-card"><div className="summary-top"><div><span className="mini-label">YOUR CREATION</span><h2>Custom Pizza 🍕</h2></div><strong>₹{pizza.total}</strong></div><div className="ingredient-list"><div><span>Base</span><b>{pizza.base.name}</b><em>₹{pizza.base.price}</em></div><div><span>Sauce</span><b>{pizza.sauce.name}</b><em>₹{pizza.sauce.price}</em></div><div><span>Cheese</span><b>{pizza.cheese.name}</b><em>₹{pizza.cheese.price}</em></div><div><span>Vegetables</span><b>{pizza.vegetables.length ? pizza.vegetables.map(v => v.name).join(", ") : "None"}</b><em>₹{pizza.vegetables.reduce((s,v)=>s+Number(v.price||0),0)}</em></div></div><div className="total-row"><span>Total</span><strong>₹{pizza.total}</strong></div></div>
  </section><aside className="checkout-card"><h2>Delivery</h2><label>Delivery Address<textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="House no., street, area, city" rows="5" required/></label><div className="secure-note">🔒 Secure Razorpay test-mode checkout</div><button className="primary-wide" disabled={loading || !address.trim()} onClick={pay}>{loading ? "Processing…" : `Pay ₹${pizza.total}`}</button>{testEnabled && <><div className="divider"><span>DEMO</span></div><button className="test-success" disabled={loading || !address.trim()} onClick={testSuccess}>✓ Test Payment Success</button></>}<button className="back-link" onClick={()=>navigate("/builder")} disabled={loading}>← Edit Pizza</button></aside>
  </main>;
}
