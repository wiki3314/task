import Joi from "@hapi/joi";

const Validation = {};

const addCustomer = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string(),
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
  location: Joi.string(),
});

const addLogs = Joi.object({
  type: Joi.string(),
  text: Joi.string(),
});

const filterLogs = Joi.object({
  locationId: Joi.string(),
  from: Joi.date(),
  to: Joi.date(),
});

Validation.addCustomer = async (req) => {
  try {
    const value = await addCustomer.validateAsync(req.body);
    return { err: null, value };
  } catch (err) {
    return { err, value: null };
  }
};

Validation.addLogs = async (req) => {
  try {
    const value = await addLogs.validateAsync(req.body);
    return { err: null, value };
  } catch (err) {
    return { err, value: null };
  }
};

Validation.filterLogs = async (req) => {
  try {
    const value = await filterLogs.validateAsync(req.body);
    return { err: null, value };
  } catch (err) {
    return { err, value: null };
  }
};

export default Validation;
