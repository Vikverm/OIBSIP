import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const POPULAR_PIZZAS = [
  {
    id: "margherita",
    name: "Margherita",
    description: "Classic tomato, mozzarella & basil",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",

    // Inventory ingredients used by the backend
    base: {
      name: "Classic Hand Tossed",
      price: 99,
    },

    sauce: {
      name: "Tomato",
      price: 25,
    },

    cheese: {
      name: "Mozzarella",
      price: 55,
    },

    vegetables: [],
  },

  {
    id: "farmhouse",
    name: "Farmhouse",
    description: "Onion, capsicum, corn & cheese",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",

    base: {
      name: "Classic Hand Tossed",
      price: 99,
    },

    sauce: {
      name: "Tomato",
      price: 25,
    },

    cheese: {
      name: "Mozzarella",
      price: 55,
    },

    vegetables: [
      {
        name: "Onion",
        price: 20,
      },
      {
        name: "Capsicum",
        price: 20,
      },
      {
        name: "Corn",
        price: 25,
      },
    ],
  },

  {
    id: "peppy-paneer",
    name: "Peppy Paneer",
    description: "Paneer, capsicum & red paprika",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",

    base: {
      name: "Classic Hand Tossed",
      price: 99,
    },

    sauce: {
      name: "Tomato",
      price: 25,
    },

    cheese: {
      name: "Mozzarella",
      price: 55,
    },

    vegetables: [
      {
        name: "Paneer",
        price: 40,
      },
      {
        name: "Capsicum",
        price: 20,
      },
    ],
  },

  {
    id: "veggie-supreme",
    name: "Veggie Supreme",
    description: "Loaded vegetables & extra cheese",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=85",

    base: {
      name: "Classic Hand Tossed",
      price: 99,
    },

    sauce: {
      name: "Tomato",
      price: 25,
    },

    cheese: {
      name: "Cheddar",
      price: 60,
    },

    vegetables: [
      {
        name: "Onion",
        price: 20,
      },
      {
        name: "Capsicum",
        price: 20,
      },
      {
        name: "Corn",
        price: 25,
      },
      {
        name: "Olives",
        price: 30,
      },
    ],
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  /*
   * Load user's orders.
   *
   * We intentionally DO NOT call the analytics API here.
   * Analytics is an admin feature.
   */
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/mine");

      setOrders(response.data || []);
      setOrdersError("");
    } catch (error) {
      console.error("Orders error:", error);

      setOrdersError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      await fetchOrders();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
   * IMPORTANT:
   * Popular pizza ADD button comes here.
   *
   * It does NOT navigate to /builder.
   *
   * Instead it prepares a pizza object and sends
   * the customer directly to Order Summary.
   */
  const handleAddPopularPizza = (pizza) => {
    const selectedPizza = {
      id: pizza.id,
      name: pizza.name,

      base: {
        ...pizza.base,
      },

      sauce: {
        ...pizza.sauce,
      },

      cheese: {
        ...pizza.cheese,
      },

      vegetables: pizza.vegetables.map(
        (vegetable) => ({
          ...vegetable,
        })
      ),

      /*
       * Keep the predefined pizza price.
       *
       * This is important because:
       * Margherita = ₹249
       * Farmhouse = ₹299
       * Peppy Paneer = ₹329
       * Veggie Supreme = ₹349
       */
      total: pizza.price,

      isPopularPizza: true,
    };

    localStorage.setItem(
      "selectedPizza",
      JSON.stringify(selectedPizza)
    );

    navigate("/summary");
  };

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-loading">
          <h2>Loading PizzaFlow...</h2>
          <p>Preparing your pizza dashboard 🍕</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">

      {/* =========================================
          HERO
      ========================================== */}

      <section className="hero">
        <div className="hero-content">

          <span className="hero-eyebrow">
            FRESH • HOT • DELIVERED
          </span>

          <h1>
            Build your perfect
            <br />
            pizza 🍕
          </h1>

          <p>
            Choose from our popular pizzas or
            create your own custom pizza.
          </p>

          <div className="hero-actions">

            <button
              className="primary"
              onClick={() => navigate("/builder")}
            >
              Customize Pizza →
            </button>

            <button
              className="secondary"
              onClick={() =>
                document
                  .getElementById("popular-pizzas")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              View Popular Pizzas
            </button>

          </div>

        </div>

        <div className="hero-pizza">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85"
            alt="Fresh Pizza"
          />
        </div>
      </section>


      {/* =========================================
          POPULAR PIZZAS
      ========================================== */}

      <section
        className="popular-section"
        id="popular-pizzas"
      >

        <div className="section-heading">

          <div>
            <span className="section-eyebrow">
              CUSTOMIZE YOUR CRAVING
            </span>

            <h2>
              Popular Pizzas
            </h2>

            <p>
              Delicious favourites, ready to
              order in one click.
            </p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/builder")}
          >
            Customize Your Own →
          </button>

        </div>


        <div className="popular-pizza-grid">

          {POPULAR_PIZZAS.map((pizza) => (

            <article
              className="popular-pizza-card"
              key={pizza.id}
            >

              <div className="popular-pizza-image">

                <img
                  src={pizza.image}
                  alt={pizza.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85";
                  }}
                />

              </div>


              <div className="popular-pizza-content">

                <h3>
                  {pizza.name}
                </h3>

                <p>
                  {pizza.description}
                </p>


                <div className="popular-pizza-bottom">

                  <strong>
                    ₹{pizza.price}
                  </strong>


                  {/* =================================
                      THIS IS THE IMPORTANT BUTTON
                  ================================== */}

                  <button
                    type="button"
                    className="add-pizza-button"
                    onClick={() =>
                      handleAddPopularPizza(
                        pizza
                      )
                    }
                  >
                    ADD +
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* =========================================
          MY ORDERS
      ========================================== */}

      <section className="orders-section">

        <div className="orders-heading">

          <div>
            <span className="section-eyebrow">
              YOUR ORDERS
            </span>

            <h2>
              My Orders
            </h2>

            <p className="live-text">
              ● Live status updates
            </p>
          </div>


          <button
            className="refresh-btn"
            onClick={loadDashboard}
          >
            Refresh
          </button>

        </div>


        {ordersError && (
          <div className="error-message">
            {ordersError}
          </div>
        )}


        {!ordersError &&
          orders.length === 0 && (

            <div className="empty-orders">

              <div className="empty-orders-icon">
                🍕
              </div>

              <h3>
                No orders yet
              </h3>

              <p>
                Order a popular pizza or
                build your own custom pizza.
              </p>

              <button
                className="primary"
                onClick={() =>
                  navigate("/builder")
                }
              >
                Build Pizza
              </button>

            </div>

          )}


        {orders.length > 0 && (

          <div className="orders-grid">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-card-top">

                  <div>
                    <span className="order-label">
                      ORDER
                    </span>

                    <h3>
                      ₹{order.total}
                    </h3>
                  </div>


                  <span
                    className={`status ${
                      String(
                        order.status || ""
                      )
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )
                    }`}
                  >
                    {order.status}
                  </span>

                </div>


                <p className="pizza-details">

                  {order.pizza?.base ||
                    "Pizza"}

                  {" • "}

                  {order.pizza?.sauce ||
                    "Sauce"}

                  {" • "}

                  {order.pizza?.cheese ||
                    "Cheese"}

                </p>


                {Array.isArray(
                  order.pizza?.vegetables
                ) &&
                  order.pizza.vegetables.length >
                    0 && (

                    <p className="pizza-details">

                      🥬{" "}
                      {order.pizza.vegetables.join(
                        ", "
                      )}

                    </p>

                  )}


                <div className="payment-row">

                  <strong>
                    Payment
                  </strong>

                  <span>
                    {order.paymentStatus}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =========================================
          CUSTOM PIZZA CTA
      ========================================== */}

      <section className="custom-pizza-cta">

        <div>

          <span className="section-eyebrow">
            YOUR PIZZA, YOUR WAY
          </span>

          <h2>
            Can't find your favourite?
          </h2>

          <p>
            Create your own pizza by choosing
            the base, sauce, cheese and
            vegetables.
          </p>

        </div>


        <button
          className="primary"
          onClick={() => navigate("/builder")}
        >
          Start Building →
        </button>

      </section>

    </main>
  );
}
