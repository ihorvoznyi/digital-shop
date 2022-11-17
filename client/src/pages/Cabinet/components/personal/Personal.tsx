import { PersonalMain } from "../index";

import './styles/Personal.scss';
import { userStore } from "../../../../store";
import { useState } from "react";

const Personal = () => {
  const userInfo = userStore.user;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleClose = () => {
    setIsEditing(false);
  }

  const handleSave = () => {}

  return (
    <div className='cabinet-personal'>
      <div className='cabinet-personal__container'>
        <h2 className='cabinet-personal__title'>
          Особиста Інформація
        </h2>

        {isEditing ? '' : <PersonalMain userInfo={userInfo}/> }

        {isEditing ? (
          <div className='cabinet-personal__editing-buttons'>
            <div className='cabinet-personal__cancel-btn' onClick={() => setIsEditing(true)}>
              <span>Відмінити</span>
            </div>

            <div className='cabinet-personal__save-btn' onClick={() => setIsEditing(true)}>
              <span>Зберегти</span>
            </div>
          </div>
        ) : (
          <div className='cabinet-personal__change-info' onClick={() => setIsEditing(true)}>
            <span>Редагувати</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Personal;
