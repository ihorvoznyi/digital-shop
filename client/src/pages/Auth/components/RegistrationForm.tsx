import { ChangeEvent, FormEvent, useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components';
import './styles/Auth.scss';

const RegistrationFrom = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [termsAgree, setTermsAgree] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!termsAgree) return;
    if(!username || !email || !password) return;
  };

  return (
    <div className="registration">
      <div className="registration__header">
        <p>Create an account</p>
        <p>or <span onClick={() => navigate('/login')}>log in</span></p>
      </div>

      <form className="registration__form" onSubmit={handleSubmit}>
        <Input
          id="registration__username-field"
          label="Username"
          type="text"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required={true}
        />
        <Input
          id="registration__email-field"
          type="email"
          label="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required={true}
        />
        <Input
          id="registration__password-field"
          type="password"
          label="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required={true}
        />
        <div className="registration__form-checkbox-field">
          <input
            id="registration__privacy-policy"
            type="checkbox"
            checked={termsAgree}
            onChange={() => setTermsAgree(checked => !checked)}
            required
          />
          <label htmlFor="registration__privacy-policy">
            I agree to the <span>Endous Terms</span>.
            Learn about how we use and protect your data in our <span>Privacy Policy</span>.
          </label>
        </div>
        <button className="registration__form-btn">
          <div>Create an account</div>
        </button>
      </form>

      <button className="registration__service-btn">
        <AiOutlineGoogle className="registration__service-btn__icon" />
        <div />
        <p>Sign up with Google</p>
      </button>
    </div>
  );
};

export default RegistrationFrom;
