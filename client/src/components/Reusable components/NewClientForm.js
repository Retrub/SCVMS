import { useState } from "react";
import axios from "axios";
import "./NewClientForm.css";

const AddClientForm = ({ history }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [city, setCity] = useState("");
  const [join_date, setJoinDate] = useState("");
  const [sport_plan, setSportPlan] = useState("");
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
      const { data } = await axios.post
      ("/api/auth/new", 
      { name, surname, email, city, birth, join_date, sport_plan},
       config);
      setSuccess(data.data);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="new-client-form">
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">{success}</span>}
      <div className="new-client-form__title">Naujas klientas</div>
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
          <label htmlFor="joinDate">Įstojimo data: </label>
          <input
            type="date"
            placeholder=""
            value={join_date}
            onChange={(e) => setJoinDate(e.target.value)}
          />
        </div>

        <div className="new-client-form__group">
          <label htmlFor="sportPlan">Trukmė: </label>
          <select
            value={sport_plan}
            onChange={(e) => setSportPlan(e.target.value)}
          >
            <option value="">Pasirinkite trukmę</option>
            <option value="1 mėnesis">1 mėnesis</option>
            <option value="2 mėnesis">2 mėnesis</option>
            <option value="3 mėnesis">3 mėnesis</option>
            <option value="4 mėnesis">4 mėnesis</option>
            <option value="5 mėnesis">5 mėnesis</option>
            <option value="6 mėnesis">6 mėnesis</option>
            <option value="12 mėnesių">12 mėnesių</option>
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
