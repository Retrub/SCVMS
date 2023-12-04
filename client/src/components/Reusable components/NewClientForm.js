import { useState } from "react";
import axios from "axios";
import "./NewClientForm.css";

const AddClientForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [city, setCity] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/new",
        { name, surname, email, city, birth, duration },
        config
      );
      setSuccess(data.data);
      setTimeout(() => {
        setSuccess("");
      }, 1000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  return (
    <div className="new-client-form">
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">{success}</span>}
      <div className="new-client-form__title">Naujas lankytojas</div>
      <form onSubmit={handleSubmit}>
        <div className="new-client-form__group">
          <label htmlFor="name">Vardas</label>
          <input
            type="text"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="surname">Pavardė</label>
          <input
            type="text"
            placeholder=""
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="email">El. paštas</label>
          <input
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="city">Miestas</label>
          <input
            type="text"
            placeholder=""
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="birth">Gimimo data: </label>
          <input
            type="date"
            placeholder=""
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="duration">Laikotarpis: </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Pasirinkite trukmę</option>
            <option value="1">1 mėnesis</option>
            <option value="3">3 mėnesiai</option>
            <option value="6">6 mėnesiai</option>
            <option value="12">12 mėnesių</option>
          </select>
        </div>

        <button className="new-client-form__button" type="submit">
          Pridėti
        </button>
      </form>
    </div>
  );
};

export default AddClientForm;
