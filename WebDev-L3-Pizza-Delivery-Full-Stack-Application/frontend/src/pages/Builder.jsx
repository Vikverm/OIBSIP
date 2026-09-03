import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const IMAGE_MAP = {
  "Cheese Burst":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",

  "Classic Hand Tossed":
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",

  "Gluten Free":
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",

  "Thin Crust":
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",

  "Whole Wheat":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",

  Alfredo:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",

  BBQ:
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80",

  Tomato:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",

  "Cheddar":
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",

  "Mozzarella":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",

  "Paneer":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",

  Capsicum:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",

  Olives:
    "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",

  Onion:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",

  TomatoVegetable:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",

  Corn:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

function getImage(name, type) {
  if (name === "Tomato" && type === "vegetable") {
    return IMAGE_MAP.TomatoVegetable;
  }

  return IMAGE_MAP[name] || FALLBACK_IMAGE;
}

function getItemName(item) {
  return item?.name || item?.itemName || item?.title || "";
}

function getItemType(item) {
  return String(
    item?.type || item?.category || item?.itemType || ""
  ).toLowerCase();
}

function getItemStock(item) {
  const stock =
    item?.stock ??
    item?.quantity ??
    item?.availableStock ??
    0;

  return Number(stock);
}

function getItemPrice(item) {
  return Number(item?.price || 0);
}

export default function Builder() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pizza, setPizza] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
  });

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/inventory");

      const inventory =
        response.data?.items ||
        response.data?.inventory ||
        response.data ||
        [];

      setItems(Array.isArray(inventory) ? inventory : []);
    } catch (err) {
      console.error("Unable to load inventory:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load pizza ingredients."
      );
    } finally {
      setLoading(false);
    }
  }

  const bases = useMemo(() => {
    return items.filter((item) => {
      const type = getItemType(item);

      return (
        type === "base" ||
        type === "bases" ||
        type === "pizza base"
      );
    });
  }, [items]);

  const sauces = useMemo(() => {
    return items.filter((item) => {
      const type = getItemType(item);

      return type === "sauce" || type === "sauces";
    });
  }, [items]);

  const cheeses = useMemo(() => {
    return items.filter((item) => {
      const type = getItemType(item);

      return type === "cheese" || type === "cheeses";
    });
  }, [items]);

  const vegetables = useMemo(() => {
    return items.filter((item) => {
      const type = getItemType(item);

      return (
        type === "vegetable" ||
        type === "vegetables" ||
        type === "veggie" ||
        type === "veggies"
      );
    });
  }, [items]);

  const currentOptions = useMemo(() => {
    if (step === 1) return bases;
    if (step === 2) return sauces;
    if (step === 3) return cheeses;
    if (step === 4) return vegetables;

    return [];
  }, [step, bases, sauces, cheeses, vegetables]);

  const currentTitle = {
    1: "Choose a Pizza Base",
    2: "Choose Your Sauce",
    3: "Choose Your Cheese",
    4: "Choose Vegetables",
  }[step];

  const currentSubtitle = {
    1: "Select the perfect base for your pizza.",
    2: "Choose a delicious sauce.",
    3: "Choose your favourite cheese.",
    4: "Add vegetables to complete your pizza.",
  }[step];

  const totalPrice = useMemo(() => {
    const basePrice = pizza.base ? getItemPrice(pizza.base) : 0;
    const saucePrice = pizza.sauce ? getItemPrice(pizza.sauce) : 0;
    const cheesePrice = pizza.cheese ? getItemPrice(pizza.cheese) : 0;

    const vegetablePrice = pizza.vegetables.reduce(
      (total, vegetable) => {
        return total + getItemPrice(vegetable);
      },
      0
    );

    return (
      basePrice +
      saucePrice +
      cheesePrice +
      vegetablePrice
    );
  }, [pizza]);

  function selectItem(item) {
    const stock = getItemStock(item);

    if (stock <= 0) {
      return;
    }

    if (step === 1) {
      setPizza((previous) => ({
        ...previous,
        base: item,
      }));
    }

    if (step === 2) {
      setPizza((previous) => ({
        ...previous,
        sauce: item,
      }));
    }

    if (step === 3) {
      setPizza((previous) => ({
        ...previous,
        cheese: item,
      }));
    }

    if (step === 4) {
      setPizza((previous) => {
        const itemName = getItemName(item);

        const alreadySelected =
          previous.vegetables.some(
            (vegetable) =>
              getItemName(vegetable) === itemName
          );

        if (alreadySelected) {
          return {
            ...previous,
            vegetables:
              previous.vegetables.filter(
                (vegetable) =>
                  getItemName(vegetable) !== itemName
              ),
          };
        }

        return {
          ...previous,
          vegetables: [
            ...previous.vegetables,
            item,
          ],
        };
      });
    }
  }

  function isSelected(item) {
    const name = getItemName(item);

    if (step === 1) {
      return getItemName(pizza.base) === name;
    }

    if (step === 2) {
      return getItemName(pizza.sauce) === name;
    }

    if (step === 3) {
      return getItemName(pizza.cheese) === name;
    }

    if (step === 4) {
      return pizza.vegetables.some(
        (vegetable) =>
          getItemName(vegetable) === name
      );
    }

    return false;
  }

  function canContinue() {
    if (step === 1) return Boolean(pizza.base);
    if (step === 2) return Boolean(pizza.sauce);
    if (step === 3) return Boolean(pizza.cheese);

    return true;
  }

  function handleNext() {
    if (!canContinue()) {
      alert("Please select an option before continuing.");
      return;
    }

    if (step < 4) {
      setStep((currentStep) => currentStep + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    localStorage.setItem("selectedPizza", JSON.stringify({
      ...pizza,
      total: totalPrice,
    }));
    navigate("/summary");
  }

  function handleBack() {
    if (step === 1) {
      navigate("/");
      return;
    }

    setStep((currentStep) => currentStep - 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function clearSelection() {
    if (step === 1) {
      setPizza((previous) => ({
        ...previous,
        base: null,
      }));
    }

    if (step === 2) {
      setPizza((previous) => ({
        ...previous,
        sauce: null,
      }));
    }

    if (step === 3) {
      setPizza((previous) => ({
        ...previous,
        cheese: null,
      }));
    }

    if (step === 4) {
      setPizza((previous) => ({
        ...previous,
        vegetables: [],
      }));
    }
  }

  if (loading) {
    return (
      <div className="builder-page">
        <div className="builder-loading">
          Loading pizza ingredients...
        </div>
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-container">
        <div className="builder-progress">
          <div className="builder-progress-top">
            <span>
              Step {step} of 4
            </span>

            <span>
              {step} / 4
            </span>
          </div>

          <div className="builder-progress-track">
            <div
              className="builder-progress-fill"
              style={{
                width: `${step * 25}%`,
              }}
            />
          </div>
        </div>

        <div className="builder-heading">
          <div>
            <h1>{currentTitle}</h1>

            <p>{currentSubtitle}</p>
          </div>

          <div className="builder-price">
            <span>Current Price</span>
            <strong>₹{totalPrice}</strong>
          </div>
        </div>

        {error && (
          <div className="builder-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadInventory}
            >
              Retry
            </button>
          </div>
        )}

        <div className="builder-options-grid">
          {currentOptions.map((item) => {
            const name = getItemName(item);
            const stock = getItemStock(item);
            const selected = isSelected(item);
            const outOfStock = stock <= 0;

            return (
              <button
                key={item._id || item.id || name}
                type="button"
                disabled={outOfStock}
                onClick={() => selectItem(item)}
                className={[
                  "builder-option-card",
                  selected
                    ? "builder-option-selected"
                    : "",
                  outOfStock
                    ? "builder-option-disabled"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="builder-image-wrapper">
                  <img
                    src={getImage(
                      name,
                      getItemType(item)
                    )}
                    alt={name}
                    className="builder-card-image"
                    onError={(event) => {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                  {selected && (
                    <div className="builder-selected-badge">
                      ✓ Selected
                    </div>
                  )}

                  {outOfStock && (
                    <div className="builder-stock-badge out">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="builder-card-content">
                  <h3>{name}</h3>

                  <p className="builder-item-price">
                    ₹{getItemPrice(item)}
                  </p>

                  <p
                    className={`builder-stock ${
                      outOfStock ? "out" : "in"
                    }`}
                  >
                    {outOfStock
                      ? "Out of Stock"
                      : `Stock: ${stock}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {!error &&
          currentOptions.length === 0 && (
            <div className="builder-empty">
              No items available for this category.
            </div>
          )}

        <div className="builder-layout-bottom">
          <div className="builder-summary-card">
            <div className="builder-summary-header">
              <h2>
                Your Pizza 🍕
              </h2>

              <span>
                ₹{totalPrice}
              </span>
            </div>

            <div className="builder-summary-row">
              <strong>Base:</strong>

              <span>
                {pizza.base
                  ? getItemName(pizza.base)
                  : "Not selected"}
              </span>
            </div>

            <div className="builder-summary-row">
              <strong>Sauce:</strong>

              <span>
                {pizza.sauce
                  ? getItemName(pizza.sauce)
                  : "Not selected"}
              </span>
            </div>

            <div className="builder-summary-row">
              <strong>Cheese:</strong>

              <span>
                {pizza.cheese
                  ? getItemName(pizza.cheese)
                  : "Not selected"}
              </span>
            </div>

            <div className="builder-summary-row">
              <strong>Vegetables:</strong>

              <span>
                {pizza.vegetables.length > 0
                  ? pizza.vegetables
                      .map((vegetable) =>
                        getItemName(vegetable)
                      )
                      .join(", ")
                  : "None"}
              </span>
            </div>
          </div>

          <div className="builder-actions">
            <button
              type="button"
              className="builder-back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

            <button
              type="button"
              className="builder-clear-button"
              onClick={clearSelection}
            >
              Clear
            </button>

            <button
              type="button"
              className="builder-next-button"
              onClick={handleNext}
            >
              {step === 4
                ? "View Summary →"
                : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}