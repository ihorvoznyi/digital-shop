import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { FaClipboardList, FaUserAstronaut } from 'react-icons/fa';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import './styles/CabinetSidebar.scss';

const CabinetSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  return (
    <div className='cabinet-sidebar'>
      <div className='cabinet-sidebar__container container'>
        <div className='cabinet-sidebar__user-info'>
          <div className='cabinet-sidebar__username'>
            <div className='cabinet-sidebar__username-icon'>
              <FaUserAstronaut />
            </div>

            <p>Ігор Возний</p>
          </div>

          <div className='cabinet-sidebar__email'>
            <p>devphase01@gmail.com</p>
          </div>

          <div className='cabinet-sidebar__phone'>
            <p>+380 (99) 634 87 51 </p>
          </div>
        </div>

        <div className='cabinet-sidebar__links'>
          <div
            className={`cabinet-sidebar__link ${location === '/cabinet/orders' ? 'active' : ''}`}
            onClick={() => navigate('/cabinet/orders')}
          >
            <FaClipboardList className='cabinet-sidebar__link-icon' />

            <span>
              Мої Змовлення
            </span>
          </div>

          <div
            className={`cabinet-sidebar__link ${location === '/cabinet' ? 'active' : ''}`}
            onClick={() => navigate('/cabinet')}
          >
            <AiOutlineUser className='cabinet-sidebar__link-icon' />

            <span>Особиста Інформація</span>
          </div>

          <div className='cabinet-sidebar__link'>
            <RiLogoutBoxRLine className='cabinet-sidebar__link-icon' />

            <span>Вийти</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinetSidebar;
