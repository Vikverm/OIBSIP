import React from "react";
const statuses = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];
export default function OrderTimeline({ currentStatus }) {
  const currentIndex = statuses.indexOf(currentStatus);
  return <div className="order-timeline">
    {statuses.map((status, index) => <div className={`timeline-step ${index <= currentIndex ? "completed" : ""} ${index === currentIndex ? "active" : ""}`} key={status}>
      <div className="timeline-circle">{index <= currentIndex ? "✓" : index + 1}</div>
      <div className="timeline-label"><strong>{status === "Preparing" ? "In Kitchen" : status === "Out for Delivery" ? "Sent to Delivery" : status}</strong><small>{index === currentIndex ? "Current status" : index < currentIndex ? "Completed" : "Waiting"}</small></div>
      {index < statuses.length - 1 && <div className={`timeline-line ${index < currentIndex ? "completed-line" : ""}`} />}
    </div>)}
  </div>;
}
