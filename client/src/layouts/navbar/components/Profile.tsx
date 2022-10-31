import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const isAuth = false;
  return (
    <div className='navbar__profile'>
      <span>
        <FaUserCircle className='navbar__profile-icon' />
      </span>

      {isAuth
        ? (
          <div className='navbar__profile-text' onClick={() => navigate('/cabinet')}>
            <span>Мій кабінет</span>
          </div>
        )
        : (
          <div className='navbar__profile-text' onClick={() => navigate('/auth')}>
            <span>Увійти</span>
          </div>
        )}
    </div>
  );
};

export default Profile;
