import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = ({ history }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/main");
    }
  }, [history]);

  const registerHandler = async (e) => {
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
      return setError("Slaptažodžiai nesutampa");
    }

    if (password.length < 8) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Slaptažodis turi būti sudarytas iš 8 simbolių.");
    }

    try {
      const { data } = await axios.post(
        "/api/auth/register",
        { username, email, password },
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
    <div className="register-page">
      <form onSubmit={registerHandler} className="register-page__form">
        <h3 className="register-page__title">Registracija</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">Vardas:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Įveskite vardą"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">El. paštas:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Įveskite el. paštą"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Slaptažodis:</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Įveskite slaptažodį"
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
            autoComplete="true"
            placeholder="Įveskite slaptažodį"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary register-page__button">
          Registruotis
        </button>
        <span className="register-page__subtext">
          Jau turite paskyrą?{" "}
          <Link className="register-page__loginLink" to="/login">
            Prisijungti
          </Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterPage;
