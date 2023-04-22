const { graphqlHTTP } = require("express-graphql");
const { buildSchema, assertInputType } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input dishInput{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
  dishes: [dishInput!]!
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(newRestaurant: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: ({ id }) => {
    const restaurantMatch = restaurants.find(r => r.id == id)
    if (!restaurantMatch) {
      throw new Error(`Restaurant with ID:${id} does not exist!`);
    }
    return restaurantMatch
  },
  restaurants: () => {
    return restaurants
  },
  setrestaurant: ({ newRestaurant }) => {
    restaurants.push(
      {
        name: newRestaurant.name,
        description: newRestaurant.description,
        dishes: newRestaurant.dishes

      }
    );
    console.log("Restaurant succesfully added!\n", JSON.stringify(newRestaurant));
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    const restaurantMatch = restaurants.find(r => r.id == id)
    if (!restaurantMatch) {
      throw new Error(`Restaurant with ID:${id} does not exist!`);
    }
    const deletedRestaurantIndex = restaurants.findIndex(r => r.id == id)
    const ok = Boolean(restaurants[deletedRestaurantIndex]);
    restaurants.splice(deletedRestaurantIndex, 1)
    console.log("Reataurant succesfully deleted!\n", JSON.stringify(restaurantMatch));
    return { ok };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    let restaurantMatch = restaurants.find(r => r.id == id)
    if (!restaurantMatch) {
      throw new Error(`Restaurant with ID:${id} does not exist!`);
    }
    restaurantMatch = {
      ...restaurantMatch,
      ...restaurant,
    };
    const editedRestaurantIndex = restaurants.findIndex(r => r.id == id);
    restaurants.splice(editedRestaurantIndex, 1, restaurantMatch)
    console.log("Restaurant succesfully updated!\n", JSON.stringify(restaurantMatch));
    return restaurantMatch;
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log(`Running GraphQL-HTTP sandbox on localhost:${port}/graphql`));

//export default root;
module.exports = root
