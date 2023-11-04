const ErrorResponse = require("../utilities/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 403) {
    const message = "Jus neturite tokių teisių";
    error = new ErrorResponse(message, 403);
  }

  if (err.code === 11000) {
    const message = "Toks el. paštas jau egzistuoja";
    error = new ErrorResponse(message, 110000);
  }

  if (err.code === "Patvirtinimo klaida") {
    const message = Object.values(err.errors).map((val) => val.message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Serverio klaida",
  });
};

module.exports = errorHandler;
