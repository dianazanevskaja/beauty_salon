import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/MastersAdmin.css';

const MastersAdmin = () => {
  const [masters, setMasters] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [workexpiriences, setWorkexpiriences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [master, setMaster] = useState({
    id: null,
    master_id: "",
    coefficient_id: 0,
    firstName: '',
    lastName: '',
    coefficient: 0,
    selectedServices: [],
  });
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchMasters = async () => {
    try {
      const response = await api.get('/api/masters');
      setMasters(response.data);
    } catch (error) {
      console.error('Error fetching masters:', error);
    }
  };
  
  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/clients');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchWorkexpiriences = async () => {
    try {
      const response = await api.get('/api/workexpirience');
      setWorkexpiriences(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  useEffect(() => {
    fetchMasters();
    fetchServices();
    fetchUsers();
    fetchWorkexpiriences();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'selectedServices') {
      const selectedServices = Array.from(e.target.selectedOptions, (option) =>
        Number(option.value)
      );
      setMaster({
        ...master,
        selectedServices,
      });
    } else {
      setMaster({
        ...master,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addMaster = () => {
    setMaster((prevMaster) => ({
      ...prevMaster,
      master_id: users[0].id,
      coefficient_id: workexpiriences[0].id,
    }));
    toggleModal();
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleAddButton = async (e) => {
  e.preventDefault();
  try {
    const { master_id, coefficient_id, selectedServices, ...newMaster } = master;
    const response = await api.post('/api/masters', {master_id, coefficient_id});
    const masterId = response.data.id;
    console.log(response.data);

    const promises = selectedServices.map((serviceId) =>
      api.post('/api/master_services', {
        master_id: masterId,
        service_id: serviceId,
      })
    );
    await Promise.all(promises);
    fetchMasters();
  } catch (error) {
    console.error('Error creating master:', error);
  }
  setMaster({
    id: null,
    master_id: "",
    coefficient_id: "",
    firstName: '',
    lastName: '',
    coefficient: 0,
    selectedServices: [],
  });
  toggleModal();
};

  const handleCloseButton = async (e) => {
    setMaster({
      id: null,
      master_id: "",
      coefficient_id: "",
      firstName: '',
      lastName: '',
      coefficient: 0,
      selectedServices: [],
    });
    showModal ? toggleModal(): toggleViewModal();
  };

  const handleDelete = async (masterId) => {
    try {
      await api.delete(`/api/masters/${masterId}`);
      await api.delete(`/api/master_services/${masterId}`);
      fetchMasters();
    } catch (error) {
      console.error('Error deleting master:', error);
    }
  };

  const handleEdit = async (master) => {
    try {
      const response = await api.get(`/api/master_services`);
      const selectedServices = response.data.filter(
        (masterService) => masterService.master_workexpirience_id === master.id
      ).map((masterService) => masterService.service_id);
      console.log(selectedServices);
      setMaster({
        ...master,
        selectedServices,
      });
    } catch (error) {
      console.error('Error fetching master services:', error);
    }
    toggleModal();
  };

  const handleUpdateButton = async (e) => {
    e.preventDefault();
    try {
      const { selectedServices, ...updatedMaster } = master;
      await api.put(`/api/masters/${updatedMaster.id}`, updatedMaster);
      await api.delete(`/api/master_services/${updatedMaster.id}`);
      const promises = selectedServices.map((serviceId) =>
        api.post('/api/master_services', {
          master_id: updatedMaster.id,
          service_id: serviceId,
        })
      );
      await Promise.all(promises);
      fetchMasters();
    } catch (error) {
      console.error('Error updating master:', error);
    }
    setMaster({
      id: null,
      master_id: "",
      coefficient_id: "",
      firstName: '',
      lastName: '',
      coefficient: 0,
      selectedServices: [],
    });
    toggleModal();
  };

  //TODO
  const loadAppointments = async (firstName, lastName) => {
    const response = await api.get('/api/appointments');
    const data = response.data;
    setAppointments(data.filter((appointment) => 
    appointment.masterFirstName === firstName
    && appointment.masterLastName === lastName));
  };

  const toggleViewModal = () => {
    setViewModal(!viewModal);
  };

  const handleViewButton = (master) => {
    setMaster(master);
    loadAppointments(master.firstName, master.lastName);
    toggleViewModal();
  }

  const formatDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMasters = masters.filter((master) => {
    const firstNameMatch = master.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    const lastNameMatch = master.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return firstNameMatch || lastNameMatch;
  });

  return (
    <section className='admin-masters'>
      <h2 className='admin-masters__title'>Administrate Masters</h2>
      <input
        className="admin-masters__search"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search masters"
      />
      <button  className='table__button table__button--add' onClick={addMaster}>Add Master</button>
      <div className='table-container'>
      <table className='admin-masters__table table'>
        <thead>
          <tr className='table__row'>
            <th className='table__header'>First Name</th>
            <th className='table__header'>Last Name</th>
            <th className='table__header'>Coefficient</th>
            <th className='table__header'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMasters.map((master) => (
            <tr className='table__row' key={master.id}>
              <td className='table__data'>{master.firstName}</td>
              <td className='table__data'>{master.lastName}</td>
              <td className='table__data'>{master.coefficient}</td>
              <td className='table__data'>
                <button className='table__button table__button--delete' onClick={() => handleDelete(master.id)}>Delete</button>
                <button className='table__button table__button--edit' onClick={() => handleEdit(master)}>Edit</button>
                {/* <button className='table__button table__button--view' onClick={() => handleViewButton(master)}>View</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal__content">
            <h2 className="modal__title">Master</h2>
            <select
              className="modal__input"
              onChange={handleChange}
              value={master.master_id}
              name="master_id"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <select
              className="modal__input"
              onChange={handleChange}
              value={master.coefficient_id}
              name="coefficient_id"
            >
              {workexpiriences.map((workexpirience) => (
                <option key={workexpirience.id} value={workexpirience.id}>
                  {workexpirience.expiriense}
                </option>
              ))}
            </select>
            <select
              className="modal__input"
              multiple
              onChange={handleChange}
              value={master.selectedServices}
              name="selectedServices"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {master.id ? (
              <button className="modal__button" onClick={handleUpdateButton}>Update</button>
            ) : (
              <button className="modal__button modal__button--add" onClick={handleAddButton}>Add</button>
            )}
            <button className="modal__button modal__button--close" onClick={handleCloseButton}>Close</button>
          </div>
        </div>
      )}
      {/* {viewModal && (
        <div className="modal">
          <div className="modal__content">
            <h2 className="modal__title">{master.firstName} {master.lastName}</h2>
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
                    <td className="table__data">{appointment.firstName} {appointment.lastName}</td>
                    <td className="table__data">{formatDate(appointment.date_signup)}</td>
                    <td className="table__data">{appointment.time_signup}</td>
                    <td className="table__data">{appointment.serviceName}</td>
                    <td className="table__data">Br {+appointment.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="modal__button modal__button--close" onClick={handleCloseButton}>Close</button>
          </div>
        </div>
      )} */}
    </section>
  );
};

export default MastersAdmin;
