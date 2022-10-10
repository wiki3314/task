import mongoose from "mongoose";
import Promise from "bluebird";
import config from "../config/env";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false,
};

mongoose.Promise = Promise;

export default (callback) => {
  mongoose
    .connect(config.mongoUri, options)
    .then((x) => {
      console.log(`Database URI: ${config.mongoUri}`);
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
      callback(null, x);
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);

      callback(err, null);
    });

  mongoose.connection.on("open", () => {
    console.log("Database connected");
  });

  mongoose.connection.on("close", () => {
    console.log("Database disconnected");
  });

  mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`);
  });


  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Database connection disconnected through app termination");
      process.exit(0);
    });
  });
};
