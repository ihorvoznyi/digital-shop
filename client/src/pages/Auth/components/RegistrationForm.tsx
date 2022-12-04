import { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../../../components';
import { registration } from '../../../store/user/services/AuthService';
import { checkIsAvailable } from '../../../store/user/services/UserService';
import { debounce } from '../../../utils';

import './styles/Auth.scss';

const RegistrationFrom = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isEmailError, setIsEmailError] = useState<boolean>(false);

  const [termsAgree, setTermsAgree] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!termsAgree) return;
    if(!phoneNumber || !email || !password) return;
    registration({ phoneNumber, email, password });
  };

  const validateEmail = (event: FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;

    checkIsAvailable(value).then((status) => setIsEmailError(!status));
  };

  const debounceValidate = useCallback(debounce(validateEmail, 200), []);

  return (
    <div className='registration'>
      <div className='registration__header'>
        <p>Create an account</p>
        <p>or <span onClick={() => navigate('/login')}>log in</span></p>
      </div>

      <form className='registration__form' onSubmit={handleSubmit}>
        <Input
          id='registration__username-field'
          label='Phone'
          type='text'
          value={phoneNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          required={true}
        />
        <Input
          id={`registration__email-field`}
          type='email'
          label='Email'
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            debounceValidate(e);
          }}
          error={isEmailError}
          required={true}
        />
        <Input
          id='registration__password-field'
          type='password'
          label='Password'
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required={true}
        />
        <div className='registration__form-checkbox-field'>
          <input
            id='registration__privacy-policy'
            type='checkbox'
            checked={termsAgree}
            onChange={() => setTermsAgree(checked => !checked)}
            required
          />
          <label htmlFor='registration__privacy-policy'>
            I agree to the <span>Endous Terms</span>.
            Learn about how we use and protect your data in our <span>Privacy Policy</span>.
          </label>
        </div>
        <button className='registration__form-btn'>
          <div>Create an account</div>
        </button>
      </form>
    </div>
  );
};

export default RegistrationFrom;
