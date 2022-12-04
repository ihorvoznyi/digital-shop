import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AiOutlineUser } from 'react-icons/ai';
import { FaClipboardList, FaUserAstronaut } from 'react-icons/fa';

import './ControlPanelSidebar.scss';
import { modalStore, userStore } from "../../../../store";

const CabinetSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const handleNavigate = (path: string) => {
    modalStore.disableModals();
    navigate(path);
  };

  return (
    <div className='control-panel__sidebar'>
      <div className='control-panel__sidebar-container'>
        <div className='control-panel__sidebar-title'>
          <div className='control-panel__sidebar-title-icon'>
            <FaUserAstronaut color='aliceblue' />
          </div>

          <p>Менеджмент </p>
        </div>

        <div className='control-panel__sidebar-links'>
          <div
            className={`control-panel__sidebar-link ${location === '/control-panel/brands' ? 'active' : ''}`}
            onClick={() => handleNavigate('/control-panel/brands')}
          >
            <FaClipboardList className='control-panel__sidebar-link-icon' />

            <span>
              Бренди
            </span>
          </div>

          <div
            className={`control-panel__sidebar-link ${location === '/control-panel/types' ? 'active' : ''}`}
            onClick={() => handleNavigate('/control-panel/types')}
          >
            <AiOutlineUser className='control-panel__sidebar-link-icon' />

            <span>Типи</span>
          </div>

          {userStore.user.role === 'Admin' && (
            <div
              className={`control-panel__sidebar-link ${location === '/control-panel/products' ? 'active' : ''}`}
              onClick={() => handleNavigate('/control-panel/products')}
            >
              <AiOutlineUser className='control-panel__sidebar-link-icon' />

              <span>Товари</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(CabinetSidebar);
