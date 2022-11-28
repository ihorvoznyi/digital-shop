import { FC } from 'react';
import { ControlPanelSidebar } from './components';

import './ControlPanel.scss';

interface PropTypes {
  children: React.ReactNode;
};

const ControlPanel: FC<PropTypes> = ({ children }) => {
  return (
    <div className="control-panel">
      <div className="control-panel__container">
        <ControlPanelSidebar />

        <div className="control-panel__content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel