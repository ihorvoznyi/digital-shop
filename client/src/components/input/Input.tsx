import { ChangeEvent, FC } from 'react';
import { IInputProps } from './input.interface';
import './input.style.scss';

const Input: FC<IInputProps> = (props) => {
  return (
    <div className="custom-input">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange(e)}
        required={props.required}

        style={{
          borderColor: props.error ? 'red' : '',
        }}
      />
    </div>
  );
};

export default Input;
