const send= (res, statusCode, message) => {
    console.error(message);
    res.status(statusCode).json({ error: message });
  };
  
  module.exports = { send };