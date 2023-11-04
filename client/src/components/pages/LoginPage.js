import { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/main");
    }
  }, [history]);

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      );

      localStorage.setItem("authToken", data.token);

      history.push("/main");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={loginHandler} className="login-page__form">
        <h3 className="login-page__title">Prisijungimas</h3>
        {error && <span className="error-message">{error}</span>}

        <div className="form-group">
          <label htmlFor="email">El. paštas:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Įveskite el. paštą"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Slaptažodis: </label>
          <input
            type="password"
            required
            id="password"
            placeholder="Įveskite slaptažodį"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary login-page__button"
          tabIndex={3}
        >
          Login
        </button>

        <span className="login-page__subtext">
          <Link
            to="/forgotpassword"
            className="login-page__forgotpassword"
            tabIndex={4}
          >
            Užmiršote slaptažodį?
          </Link>
        </span>

        <span className="login-page__subtext">
          Neturite paskyros?{" "}
          <Link className="login-page__registerLink" to="/register">
            Registracija
          </Link>
        </span>
      </form>
    </div>
  );
};

export default LoginPage;
