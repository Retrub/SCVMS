import { useState } from "react";
import axios from "axios";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/forgotpassword",
        { email },
        config
      );

      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error);
      setEmail("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="forgotpassword-page">
      <form
        onSubmit={forgotPasswordHandler}
        className="forgotpassword-page__form"
      >
        <h3 className="forgotpassword-page__title">Pamiršote slaptažodį</h3>
        {error && <span className="error-message">{error}</span>}
        {success && <span className="success-message">{success}</span>}
        <div className="form-group">
          <p className="forgotpassword-page__subtext">
            Įveskite el. pašto adresą, kuriuo esate užsiregistravę. Šiuo el.
            paštu atsiųsime jums slaptažodžio nustatymo iš naujo patvirtinimą.
          </p>
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
        <button
          type="submit"
          className="btn btn-primary forgotpassword-page__button"
        >
          Siųsti nuorodą
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
