import { FC, FormEvent } from 'react';
import { observer } from "mobx-react-lite";

interface PropsType {
  onChange: (property: string, value: string) => void;
}

const HomeAddress: FC<PropsType> = ({ onChange }) => {
  return (
    <div className='order-page__post-office'>
      <input
        type='text'
        placeholder='Львів'
        className='order-page__shipping-input custom-input'
        onChange={(e: FormEvent<EventTarget>) => {
          const { value } = e.target as HTMLInputElement;
          onChange('city', value);
        }}
        required
      />
      <input
        type='text'
        placeholder='Городоцька 276А'
        className='order-page__shipping-input custom-input'
        onChange={(e: FormEvent<EventTarget>) => {
          const { value } = e.target as HTMLInputElement;
          onChange('address', value);
        }}
        required
      />
    </div>
  );
};

export default observer(HomeAddress);
