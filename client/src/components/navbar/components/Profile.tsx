import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { userStore } from "../../../store";

import './styles/Profile.scss';
import { observer } from "mobx-react-lite";

const Profile = observer(() => {
  const navigate = useNavigate();

  const isAuth: boolean = userStore.isAuth;

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
});

export default Profile;
