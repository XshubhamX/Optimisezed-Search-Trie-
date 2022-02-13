const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  address: {
    type: Object,
  },
  cuisine: {
    type: String,
    required: true,
  },
  grades: [
    {
      type: Object,
      required: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  restaurant_id: {
    type: String,
    required: true,
  },
});

module.exports = Restaurant = mongoose.model("restaurants", RestaurantSchema);
