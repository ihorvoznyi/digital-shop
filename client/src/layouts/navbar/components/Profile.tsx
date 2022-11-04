import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './styles/Profile.scss';

const Profile = () => {
  const navigate = useNavigate();

  const isAuth = true;

  const path = isAuth ? '/cabinet' : '/login';

  return (
    <div className='navbar__profile' onClick={() => navigate(path)}>
      <span>
        <FaUserCircle className='navbar__profile-icon' />
      </span>

      {isAuth
        ? (
          <div className='navbar__profile-text'>
            <span>Мій кабінет</span>
          </div>
        )
        : (
          <div className='navbar__profile-text'>
            <span>Увійти</span>
          </div>
        )}
    </div>
  );
};

export default Profile;
