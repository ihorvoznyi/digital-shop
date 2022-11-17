import React, { FC } from 'react';

import { IUser } from "../../../../store/user/interfaces";

import './styles/PersonalEdit.scss';

interface PropsType {
  userInfo: IUser;
}

const PersonalEdit: FC<PropsType> = ({ userInfo }) => {
  return (
    <div>
      
    </div>
  );
};

export default PersonalEdit;