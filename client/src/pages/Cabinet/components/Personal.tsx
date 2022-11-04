import './styles/Personal.scss';
import { userStore } from "../../../store";
import { toPhoneNumber } from "../../../utils/toPhoneNumber";

const Personal = () => {
  const { phoneNumber, email } = userStore.user;
  return (
    <div className='cabinet-personal'>
      <div className='cabinet-personal__container'>
        <h2 className='cabinet-personal__title'>
          Особиста Інформація
        </h2>

        <div className='cabinet-personal__info'>
          <div className='cabinet-personal__row'>
            <p>Ім'я та Прізвище:</p>
            <p>Ігор Возний</p>
          </div>

          <div className='cabinet-personal__row'>
            <p>Номер телефону:</p>
            <p>{toPhoneNumber(phoneNumber)}</p>
          </div>

          <div className='cabinet-personal__row'>
            <p>E-mail:</p>
            <p>{email}</p>
          </div>
        </div>

        <div className='cabinet-personal__change-info'>
          <span>Редагувати</span>
        </div>
      </div>
    </div>
  );
};

export default Personal;
