module.exports = async (req, res, error) => {
  // Handle Joi error
  if (error.isJoi) {
    delete error.isJoi;
    delete error._object;
    return res.status(400).send({
      status: "error",
      message:
        error && error.details.length > 0 && error.details[0].message
          ? error.details[0].message
          : "Error",
    });
  }

  //Handle other back-end error
  return res.status(500).send({
    status: "error",
    message: "Back-end error",
  });
};
