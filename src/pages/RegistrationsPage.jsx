import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";
import styles from "./RegistrationsPage.module.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    async function getRegistrations() {
      const response = await fetch(
        `${SUPABASE_URL}/registrations?order=createdAt.desc`,
        { headers },
      );
      const data = await response.json();
      setRegistrations(data);
      setRegistrationCount(data.length);
    }

    getRegistrations();
  }, []);

  return (
    <>
      <header className={styles.adminHeader}>
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className={styles.registrationList}>
          <div
            className={`${styles.registrationRow} ${styles.registrationLabels}`}
          >
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {registrations.map((registration) => (
            <div className={styles.registrationRow} key={registration.id}>
              <div>
                <strong>{registration.users?.name}</strong>
                <small>{registration.users?.email}</small>
              </div>
              <span>{registration.eventTitle}</span>
              <span>
                {new Date(registration.eventDate).toLocaleDateString("da-DK")}
              </span>
              <span className={styles.status}>{registration.status}</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
