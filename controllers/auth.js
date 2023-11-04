const crypto = require("crypto");
const User = require("../models/User");
const Client = require("../models/Client");
const ErrorResponse = require("../utilities/errorResponse");
const sendEmail = require("../utilities/sendEmail");
const jwt = require("jsonwebtoken");

//User Controller
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendTokenAndRole(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Prašome pateikti el. pašto adresą ir slaptažodį", 400)
    );
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Duomenys neteisingi", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Duomenys neteisingi", 401));
    }
    sendTokenAndRole(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("El. pašto išsiųsti nepavyko", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    const message = `
    <h1> Prašymas iš naujo nustatyti slaptažodį </h1>
    <p>Norėdami iš naujo nustatyti slaptažodį, paspauskite ant šios nuorodos</p>
    <a href = ${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Slaptažodžio nustatymo iš naujo užklausa",
        text: message,
      });
      res.status(200).json({ success: true, data: " El. laiškas išsiųstas" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("El. pašto išsiųsti nepavyko", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorResponse("Neteisingas atkūrimo prieigos raktas", 400)
      );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: " Slaptažodis atstatytas sėkmingai",
    });
  } catch (error) {
    next(error);
  }
};
// Send Token
const sendTokenAndRole = (user, statusCode, res) => {
  const token = user.getSignedToken();

  res.status(statusCode).json({ success: true, token });
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Bearer token example: Bearer 42dfgf68dfg2fdg45sdf4s5dsf
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    res.status(200).json({
      success: true,
      username: user.username,
    });

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this routes", 401));
  }
};

//Clients Controller
exports.addClient = async (req, res, next) => {
  const { name, surname, email, city, birth, join_date, sport_plan } = req.body;

  try {
    const client = await Client.create({
      name,
      surname,
      email,
      city,
      birth,
      join_date,
      sport_plan,
    });
    await client.save();

    res
      .status(200)
      .json({ success: true, data: " Klientas sėkmingai sukurtas" });
  } catch (error) {
    next(error);
  }
};

exports.readClients = async (req, res) => {
  try {
    const clients = await Client.find();

    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch users" });
  }
};

exports.readClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch users" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the client" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params; // Get the client ID from the route parameters
    const updateData = req.body; // This should be the updated data for the client

    console.log(updateData);
    const client = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!client) {
      res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client); // You can respond with the updated client data
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the client" });
  }
};
