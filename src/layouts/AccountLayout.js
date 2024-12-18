import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import "../styles/AccountLayout.css";

const AccountLayout = () => {
  return (
    <>
      <header className="account__navigation">
        <nav>
          <ul className="account__navigation-list">
            <li className="account__navigation-item">
              <Link to="" className="account__navigation-link">Account</Link>
            </li>
            <li className="account__navigation-item">
              <Link to="booking" className="account__navigation-link">Booking</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AccountLayout;
