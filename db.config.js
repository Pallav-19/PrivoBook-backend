const mongoose = require("mongoose");
const mongoConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("mongoose - atlas connected");
    })
    .catch((err) => console.log(err));
};
module.exports = mongoConnection;
