import React from 'react';
import { isAdmin } from '../../utils/auth';
import AdminLogin from './AdminLogin';
import api from '../../api';
import '../../styles/AdminPage.css';

const AdminPage = () => {
  const isLoggedIn = isAdmin();

  const handleLogin = async (login, password) => {
    api.post('/api/admin', {
      login,
      password,
    })
    .then((response) => {
      const data = response.data;
      sessionStorage.setItem('admin', JSON.stringify(data));
      window.location.href = '/admin';
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <section>
      {isLoggedIn && (
        <>
          <h2 className="admin-page__heading">You can work with clients, masters, services, categories</h2>
          <h3 className="admin-page__sub-heading">Add new</h3>
          <h3 className="admin-page__sub-heading">Edit</h3>
          <h3 className="admin-page__sub-heading">Delete</h3>
          <button className="admin-page__btn" onClick={handleLogout}>Log out</button>
        </>
      )}
    </section>
  );
};

export default AdminPage;
