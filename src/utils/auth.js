export const isAuthenticated = () => {
  const user = localStorage.getItem('user');

  return !!user;
};

export const isMaster = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user?.role_id == 2;
};

export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user?.role_id == 1;
};