import express from "express";
import bodyParser from "body-parser";
import httpStatus from "http-status";
import cors from "cors";

import dbConnection from "./src/db/db";

import Validation from "./validation";
import Customers from "./customers";
import CusomterLogs from "./customerLogs";
import Location from "./locations";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

dbConnection((dbError, db) => {
  if (dbError) {
    throw dbError;
  }

  app.post("/customer/create", async (req, res, next) => {
    const { err, value } = await Validation.addCustomer(req);
    if (err) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid parameters", err });
    }
    try {
      const { firstName, lastName, email, phone, location } = value;
      const customer = await Customers.findOne({ email });

      if (customer) {
        return res.status(409).json({ statusCode: 409, success: false });
      } else {
        const locationData = await Location.findOne({ name: location });
        if (locationData) {
          value.locationId = locationData.locationId;
        } else {
          const newLocation = await Location.create({ name: location });
          value.locationId = newLocation.locationId;
        }

        const newCustomer = await Customers.create(value);
        const Log = await CusomterLogs.create({
          customerId: newCustomer.customerId,
          type: "signup",
          text: "customer create",
        });

        return res
          .status(httpStatus.OK)
          .json({ statusCode: 200, success: true, user: newCustomer });
      }
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  });

  app.post("/logs/:customerId", async (req, res, next) => {
    const { err, value } = await Validation.addLogs(req);
    const { customerId } = req.params;
    console.log("customerId", customerId);
    if (err) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid parameters", err });
    }
    try {
      const { type, text } = value;
      const log = await CusomterLogs.create({
        customerId,
        type,
        text,
      });
      return res
        .status(httpStatus.OK)
        .json({ statusCode: 200, success: true, logs: log });
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  });

  app.get("/customer/logs", async (req, res, next) => {
    const { err, value } = await Validation.filterLogs(req);
    if (err) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid parameters", err });
    }
    try {
      const { from, to, locationId } = value;

      return Customers.aggregate([
        { $match: { locationId } },
        {
          $lookup: {
            from: "customerlogs",

            let: { customerId: "$customerId", from, to },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $eq: ["$$customerId", "$customerId"],
                      },
                    },
                    {
                      $and: [
                        {
                          $expr: {
                            $gt: ["$date", "$$from"],
                          },
                        },
                        {
                          $expr: {
                            $lt: ["$date", "$$to"],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            as: "customerlogsDetails",
          },
        },
      ])
        .then((result) => {
          return res
            .status(httpStatus.OK)
            .json({ statusCode: 200, success: true, result });
        })
        .catch((error) => {
          console.log("error", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
        });
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  });
});

export default app;
