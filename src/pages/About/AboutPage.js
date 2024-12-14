import React from 'react';
import '../../styles/About.css';

const ContactPage = () => {
  return (
    <div className="container">
      <h1>Beauty salon contacts</h1>
      <div className="contact-info">
        <p><strong>Address:</strong> T. Grodno, st. Suvorova, 308 </p>
        <p><strong>Opening hours:</strong> Mon-Sun </p>
        <p style={{paddingLeft: "125px"}}> 09:00 - 18:00 </p>
        <p style={{paddingLeft: "125px"}}> (No days off) </p>
        <p><strong>Telephone:</strong> +375 (33) 333-33-33</p>
        <p><strong>Email:</strong> beauty@gmail.com</p>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <ContactPage />
  );
};

export default AboutPage;