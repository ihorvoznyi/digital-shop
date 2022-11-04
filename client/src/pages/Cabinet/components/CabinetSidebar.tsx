import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { FaClipboardList, FaUserAstronaut } from 'react-icons/fa';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import './styles/CabinetSidebar.scss';
import { userStore } from "../../../store";
import { toPhoneNumber } from "../../../utils/toPhoneNumber";

const CabinetSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const { phoneNumber, email } = userStore.user;

  return (
    <div className='cabinet-sidebar'>
      <div className='cabinet-sidebar__container container'>
        <div className='cabinet-sidebar__user-info'>
          <div className='cabinet-sidebar__username'>
            <div className='cabinet-sidebar__username-icon'>
              <FaUserAstronaut color='aliceblue'/>
            </div>

            <p>Ігор Возний</p>
          </div>

          <div className='cabinet-sidebar__email'>
            <p>{email}</p>
          </div>

          <div className='cabinet-sidebar__phone'>
            <p>{toPhoneNumber(phoneNumber)}</p>
          </div>
        </div>

        <div className='cabinet-sidebar__links'>
          <div
            className={`cabinet-sidebar__link ${location === '/cabinet/orders' ? 'active' : ''}`}
            onClick={() => navigate('/cabinet/orders')}
          >
            <FaClipboardList className='cabinet-sidebar__link-icon'/>

            <span>
              Мої Змовлення
            </span>
          </div>

          <div
            className={`cabinet-sidebar__link ${location === '/cabinet' ? 'active' : ''}`}
            onClick={() => navigate('/cabinet')}
          >
            <AiOutlineUser className='cabinet-sidebar__link-icon'/>

            <span>Особиста Інформація</span>
          </div>

          <div className='cabinet-sidebar__link' onClick={() => userStore.logout()}>
            <RiLogoutBoxRLine className='cabinet-sidebar__link-icon'/>

            <span>Вийти</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetSidebar;
