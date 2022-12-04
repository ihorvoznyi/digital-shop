import './styles/Auth.scss';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillApple } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { observer } from "mobx-react-lite";
import { Input } from '../../../components';
import { userStore } from "../../../store";
import { login } from '../../../store/user/services/AuthService';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => navigate('/login'), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    login({ email, password });
  };

  return (
    <div className='login'>
      <div className='login__header'>
        <p>Sign in</p>
        <p>or <span onClick={() => navigate('/registration')}>create an account</span></p>
      </div>

      <form className='login__form' onSubmit={handleSubmit}>
        <Input
          id='login__email-field'
          type='text'
          label='Email'
          value={email}
          required={true}
          onChange={((e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value))}
        />
        <Input
          id='login__password-field'
          type='password'
          label='Password'
          value={password}
          required={true}
          onChange={((e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value))}
        />

        <button type='submit' className='login__form-btn'>
          <div>Sign in</div>
        </button>
      </form>
    </div>
  );
};

export default observer(LoginForm);
