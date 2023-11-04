import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./ResetPasswordPage.css";

const ResetPasswordPage = ({ match }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError(" Slaptažodžiai nesutampa");
    }

    try {
      const { data } = await axios.put(
        `/api/auth/resetpassword/${match.params.resetToken}`,
        {
          password,
        },
        config
      );

      console.log(data);
      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="resetpassword-page">
      <form
        onSubmit={resetPasswordHandler}
        className="resetpassword-page__form"
      >
        <h3 className="resetpassword-page__title">Pamiršote slaptažodį</h3>
        {error && <span className="error-message">{error} </span>}
        {success && (
          <span className="success-message">
            {success}{" "}
            <Link className="resetpassword-page__loginLink" to="/login">
              Login
            </Link>
          </span>
        )}
        <div className="form-group">
          <label htmlFor="password"> Naujas slaptažodis:</label>
          <input
            type="password"
            required
            id="password"
            placeholder="Įveskite naują slaptažodį"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Patvirtinkite slaptažodį:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Įveskite slaptažodį"
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary resetpassword-page__button"
        >
          Atstatyti slaptažodį
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
