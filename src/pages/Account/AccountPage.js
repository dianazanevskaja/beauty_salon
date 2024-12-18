import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../styles/AccountPage.css';
import { isMaster } from '../../utils/auth';
import ProfilePic from "../../assets/Default_pfp.jpg";

const AccountPage = () => {
  const isMasterIn = isMaster();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmensMaster, setAppointmentsMaster] = useState([]);
  const [personalData, setPersonalData] = useState(true); 

  const loadUser = async(email) => {
    api.get(`/api/clients/${email}`)
    .then((response) => {
      const userData = response.data;
      setUser(userData);
    })
    .catch((error) => {
      console.error('Error retrieving user information:', error);
    });
  }
  const loadAppointments = async (id) => {
    const response = await api.get('/api/appointments?client_id=');
    const data = response.data;
    setAppointments(data.filter((appointment) => appointment.client_id == id));
    setAppointmentsMaster(data.filter((appointment) => appointment.master_id == id));
  };
  
  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    const email = loggedInUser.email;
    loadUser(email);
    loadAppointments(loggedInUser.id);
  }, []);

  const formatDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = ('/');
  };

  return (
    <section className="account-page">
      <h2 className='account-page__title'>Account Information</h2>
      {user ? (
        <div className="account-page__info">
          <img className='account-page__image' src={ProfilePic} alt="profile" />
          <div className='account-page__text'>
            <p className='account-page__paragraph'>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p className='account-page__paragraph'>
              <strong>Email:</strong> {user.email}
            </p>
            <p className='account-page__paragraph'>
              <strong>Phone Number:</strong> {user.phone_number}
            </p>
            <p className='account-page__paragraph'>
              <strong>Birthday:</strong> {formatDate(user.birthday)}
            </p>
            <button className='account-page__button' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <p className='account-page__paragraph'>Loading user information...</p>
      )}
    <div>
      {isMasterIn && (<button className='account-page__button' onClick={() => setPersonalData(!personalData)}>{personalData ? "Clients" : "My Appointments"}</button>)}
      <div>
        {personalData ? (
          <>
            <h2>Appointments</h2>
            <div className='table-container'>
            <table className="table">
              <thead>
                <tr className='table__row'>
                  <th className="table__header">Date</th>
                  <th className="table__header">Time</th>
                  <th className="table__header">Master</th>
                  <th className="table__header">Service</th>
                  <th className="table__header">Price</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr className="table__row" key={appointment.id}>
                    <td className="table__data">{formatDate(appointment.date_signup)}</td>
                    <td className="table__data">{appointment.time_signup}</td>
                    <td className="table__data">{appointment.masterFirstName} {appointment.masterLastName}</td>
                    <td className="table__data">{appointment.serviceName}</td>
                    <td className="table__data">Br {+appointment.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        ) : (
          <>
            <h2>Clients</h2>
            <div className='table-container'>
            <table className="table">
              <thead>
                <tr className='table__row'>
                  <th className="table__header">Date</th>
                  <th className="table__header">Time</th>
                  <th className="table__header">Client</th>
                  <th className="table__header">Service</th>
                  <th className="table__header">Price</th>
                </tr>
              </thead>
              <tbody>
                {appointmensMaster.map((appointment) => (
                  <tr className="table__row" key={appointment.id}>
                    <td className="table__data">{formatDate(appointment.date_signup)}</td>
                    <td className="table__data">{appointment.time_signup}</td>
                    <td className="table__data">{appointment.firstName} {appointment.lastName}</td>
                    <td className="table__data">{appointment.serviceName}</td>
                    <td className="table__data">Br {+appointment.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </div>
    </section>
  );
};

export default AccountPage;
