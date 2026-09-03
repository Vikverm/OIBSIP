import React from "react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ff6b00",
  "#2ecc71",
  "#3498db",
  "#f1c40f",
];

export default function AnalyticsCharts({ charts }) {
  const orderStatus = charts?.orderStatus || [];

  const paymentStatus = charts?.paymentStatus || [];

  const revenue = charts?.revenue || [];

  return (
    <section className="analytics-section">
      <div className="charts-grid">
        {/* ORDER STATUS */}

        <div className="chart-card">
          <h2>Orders by Status</h2>

          <p>Current order distribution</p>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={orderStatus}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 11,
                }}
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                name="Orders"
                fill="#ff6b00"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PAYMENT STATUS */}

        <div className="chart-card">
          <h2>Payment Status</h2>

          <p>Payment distribution</p>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={paymentStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {paymentStatus.map(
                  (entry, index) => (
                    <Cell
                      key={`payment-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REVENUE OVERVIEW */}

      <div className="chart-card revenue-chart">
        <h2>Revenue Overview</h2>

        <p>Revenue for the last 7 days</p>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart
            data={revenue}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip
              formatter={(value) =>
                `₹${value}`
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#ff6b00"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}