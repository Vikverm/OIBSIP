import Inventory from "../models/Inventory.js";

export const getPizzaIngredientNames = (pizza = {}) => [
  pizza.base,
  pizza.sauce,
  pizza.cheese,
  ...(pizza.vegetables || []),
].filter(Boolean);

export const checkInventory = async (pizza) => {
  const names = getPizzaIngredientNames(pizza);
  const items = [];

  for (const name of names) {
    const item = await Inventory.findOne({ name });
    if (!item) throw new Error(`Inventory item not found: ${name}`);
    if (item.stock < 1) throw new Error(`${name} is out of stock`);
    items.push(item);
  }

  return items;
};

export const consumeInventory = async (pizza) => {
  const names = getPizzaIngredientNames(pizza);
  if (!names.length) throw new Error("Pizza ingredients are required");

  // Validate everything before changing anything.
  await checkInventory(pizza);

  const consumed = [];
  try {
    for (const name of names) {
      const item = await Inventory.findOneAndUpdate(
        { name, stock: { $gte: 1 } },
        { $inc: { stock: -1 } },
        { new: true }
      );
      if (!item) throw new Error(`${name} went out of stock. Please try again.`);
      consumed.push(item);
    }
  } catch (error) {
    // Best-effort rollback if a concurrent order wins a stock race.
    for (const item of consumed) {
      await Inventory.findByIdAndUpdate(item._id, { $inc: { stock: 1 } });
    }
    throw error;
  }

  return consumed;
};
