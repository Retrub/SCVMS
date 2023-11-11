const crypto = require("crypto");
const User = require("../models/User");
const Client = require("../models/Client");
const ClientEntry = require("../models/ClientEntry");
const Membership = require("../models/Membership");
const MembershipEntry = require("../models/MembershipEntry");
const sendEmail = require("../utilities/sendEmail");
const jwt = require("jsonwebtoken");

const encryption = require("../config/encryption");
const ErrorResponse = require("../utilities/errorResponse");

//User Controller
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const message = "Prašome pateikti el. pašto adresą ir slaptažodį";
    ErrorResponse.send(res, 400, message);
  } else {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        const message = "Vartotojas nerastas";
        ErrorResponse.send(res, 401, message);
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        const message = "Duomenys neteisingi";
        ErrorResponse.send(res, 401, message);
      }
      sendToken(user, 200, res);
    } catch (error) {}
  }
};

exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const message = "El. pašto išsiųsti nepavyko";
      ErrorResponse.send(res, 404, message);
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
      res.status(200).json({ data: " El. laiškas išsiųstas" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      ErrorResponse.send(res, 500, error.message);
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res) => {
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
      const message = "Neteisingas atkūrimo prieigos raktas";
      ErrorResponse.send(res, 400, message);
    } else {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ message: "Slaptažodis atstatytas sėkmingai" });
    }
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

// Send Token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};

//Main function
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
    const message = "Nustatyti tapatybės nepavyko. Prisijungite";
    ErrorResponse.send(res, 401, message);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      const message = "Pagal pateikta ID vartotojas nerastas";
      ErrorResponse.send(res, 404, message);
    }

    const userObject = encryption.encrypt(user);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.status(200).json({ userObject, EncryptedSecretKey });

    req.user = user;
    next();
  } catch (error) {
    if (error.message.includes("expiredAt:")) {
      const message = "Jūsų autorizacijos žetono laikas pasibaigė";
      ErrorResponse.send(res, 401, message);
    } else {
      ErrorResponse.send(res, 500, error.message);
    }
  }
};

//Clients Controller
exports.addClient = async (req, res) => {
  const { name, surname, email, city, birth, duration } = req.body;

  const currentDate = new Date();
  const validityMonths = parseInt(duration);

  const validUntil = new Date();
  validUntil.setMonth(currentDate.getMonth() + validityMonths);

  try {
    const client = await Client.create({
      name,
      surname,
      email,
      city,
      birth,
      join_date: currentDate,
      duration,
      valid_until: validUntil,
      access: "Patvirtinta",
      status: "Neaktyvus",
    });
    await client.save();

    const membershipId = await Membership.findOne({
      duration_months: validityMonths,
    });

    const clientId = await Client.findOne({
      email: email,
    });

    const offset = 2; // Lithuania is UTC+2
    const localDate = new Date(currentDate.getTime() + offset * 60 * 60 * 1000);

    const membershipEntry = await MembershipEntry.create({
      client_id: clientId._id,
      membership_id: membershipId._id,
      membership_type: "Nauja narystė",
      date: localDate,
    });
    await membershipEntry.save();

    res.status(200).json({ data: " Klientas sėkmingai sukurtas" });
  } catch (error) {
    if (error.code === 11000) {
      const message = "El. pašto adresas jau toks egzistuoja.";
      ErrorResponse.send(res, 400, message);
    } else {
      ErrorResponse.send(res, 400, error.message);
    }
  }
};

exports.readClients = async (req, res) => {
  try {
    const clients = await Client.find();

    // Suformuojami datos laukai
    const formattedClients = clients.map((client) => {
      const formattedClient = client.toObject();

      if (client.join_date instanceof Date) {
        formattedClient.join_date = client.join_date
          .toISOString()
          .split("T")[0];
      }

      if (client.valid_until instanceof Date) {
        formattedClient.valid_until = client.valid_until
          .toISOString()
          .split("T")[0];
      }

      return formattedClient;
    });

    const clientObject = encryption.encrypt(formattedClients);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.json({ clientObject, EncryptedSecretKey });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

exports.readClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);

    const clientObject = encryption.encrypt(client);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.json({ clientObject, EncryptedSecretKey });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Klientas sėkmingai ištrintas" });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const clientInfo = await Client.findById(id);

    //Sukuriamas naujas įrašas, kadangi buvo pratestą narystė
    if (updateData.valid_until) {
      const updateValidUntil = new Date(updateData.valid_until);
      const clientValidUntil = new Date(clientInfo.valid_until);

      const timeDiff = updateValidUntil.getTime() - clientValidUntil.getTime();
      const monthDiff = Math.round(timeDiff / (1000 * 3600 * 24 * 30));

      const membershipId = await Membership.findOne({
        duration_months: monthDiff,
      });

      const currentDate = new Date();
      const offset = 2; // Lithuania is UTC+2
      const localDate = new Date(
        currentDate.getTime() + offset * 60 * 60 * 1000
      );

      const membershipEntry = await MembershipEntry.create({
        client_id: id,
        membership_id: membershipId._id,
        membership_type: "Narystė pratestą",
        date: localDate,
      });
      await membershipEntry.save();
    }

    const client = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!client) {
      const message = "Klientas nerastas";
      ErrorResponse.send(res, 404, message);
    }
    const clientUpdateObject = encryption.encrypt(client);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.status(200).json({ clientUpdateObject, EncryptedSecretKey });
  } catch (error) {
    if (error.code === 11000) {
      const message = "El. pašto adresas jau toks egzistuoja.";
      ErrorResponse.send(res, 400, message);
    } else {
      ErrorResponse.send(res, 400, error.message);
    }
  }
};

exports.entryClient = async (req, res) => {
  const { id } = req.params;

  const clientEntryCheck = await ClientEntry.findOne({
    clientId: id,
    exitTime: null,
  });

  if (clientEntryCheck) {
    const message = "Klientas yra sporto salėje.";
    ErrorResponse.send(res, 404, message);
  } else {
    try {
      const entryTime = new Date();
      const clientEntry = await ClientEntry.create({ clientId: id, entryTime });
      await clientEntry.save();

      await Client.findByIdAndUpdate(id, { status: "Aktyvus" });

      res.status(200).json({ message: "Kliento įėjimas įrašytas" });
    } catch (error) {
      const message = "Klaida įvedant kliento pradinį laiką.";
      ErrorResponse.send(res, 500, message);
    }
  }
};

exports.exitClient = async (req, res) => {
  try {
    const { id } = req.params;
    const exitTime = new Date();
    const clientEntry = await ClientEntry.findOne({
      clientId: id,
      exitTime: null,
    });

    if (clientEntry) {
      clientEntry.exitTime = exitTime;
      await clientEntry.save();

      await Client.findByIdAndUpdate(id, { status: "Neaktyvus" });

      res.status(200).json({ message: "Kliento išėjimas įrašytas" });
    } else {
      const message = "Aktyvaus kliento įrašo nerasta";
      ErrorResponse.send(res, 404, message);
    }
  } catch (error) {
    ErrorResponse.send(res, 500, error.message);
  }
};

// Clients entries and exits controller

exports.readEntries = async (req, res) => {
  try {
    const entries = await ClientEntry.find();

    const formattedClientsEntries = await Promise.all(
      entries.map(async (entry) => {
        const formattedEntry = entry.toObject();

        if (entry.entryTime instanceof Date) {
          formattedEntry.entryTime = entry.entryTime
            .toISOString()
            .split(".")[0];
        }

        if (entry.exitTime instanceof Date) {
          formattedEntry.exitTime = entry.exitTime.toISOString().split(".")[0];
        }

        const timeDifference = entry.exitTime - entry.entryTime;

        const hoursDifference = timeDifference / (1000 * 60);

        const spentTime = Math.round(hoursDifference);

        const clientsId = formattedEntry.clientId;

        const clientInfo = await Client.findOne({ _id: clientsId });

        formattedEntry.clientInfo = clientInfo;
        formattedEntry.spentTime = spentTime;

        return formattedEntry;
      })
    );

    const clientEntriesObjects = encryption.encrypt(formattedClientsEntries);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.status(200).json({ clientEntriesObjects, EncryptedSecretKey });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

exports.dashboardInfo = async (req, res) => {
  try {
    const entries = await ClientEntry.find();
    const clients = await Client.find();

    const currentDate = new Date();

    // Išfiltruojami šios dienos įrašai
    const entriesToday = entries.filter((entry) => {
      return (
        new Date(entry.entryTime).toDateString() === currentDate.toDateString()
      );
    });

    // Išfiltruojami šio mėnesio įrašai
    const entriesThisMonth = entries.filter((entry) => {
      const entryDate = new Date(entry.entryTime);
      return (
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const clientsThisMonth = clients.filter((client) => {
      const clientDate = new Date(client.join_date);
      return (
        clientDate.getMonth() === currentDate.getMonth() &&
        clientDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const entriesNow = entries.filter((entry) => {
      return entry.exitTime === undefined;
    });

    const dashboardStats = {
      visitorsToday: entriesToday.length,
      visitorsMonth: entriesThisMonth.length,
      clientsAmount: clients.length,
      clientsAmountMonth: clientsThisMonth.length,
      visitorsNow: entriesNow.length,
    };

    res.json({ dashboardStats });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

//Plans controller

exports.readMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    const membershipsObjects = encryption.encrypt(memberships);
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;

    res.status(200).json({ membershipsObjects, EncryptedSecretKey });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};

exports.readMembershipsEntries = async (req, res) => {
  try {
    const membershipsEntries = await MembershipEntry.find();

    const formattedMembershipsEntries = await Promise.all(
      membershipsEntries.map(async (entry) => {
        const formattedEntry = entry.toObject();

        if (entry.date instanceof Date) {
          formattedEntry.date = entry.date.toISOString().split(".")[0];
        }

        const clientsId = formattedEntry.client_id;

        const clientInfo = await Client.findOne({ _id: clientsId });

        formattedEntry.clientInfo = clientInfo;

        const membershipId = formattedEntry.membership_id;

        const membershipInfo = await Membership.findOne({ _id: membershipId });

        formattedEntry.membershipInfo = membershipInfo;

        return formattedEntry;
      })
    );
    const membershipEntriesObjects = encryption.encrypt(
      formattedMembershipsEntries
    );
    const EncryptedSecretKey = process.env.SECRET_KEY_ENCRYPTION;
    res.status(200).json({ membershipEntriesObjects, EncryptedSecretKey });
  } catch (error) {
    ErrorResponse.send(res, 400, error.message);
  }
};