import React, { FC } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import './Rating.scss';

interface PropsType {
  rating: number;
  fontSize: string;
  onClick?: (estimate: number) => void;
}

const numbers = [1, 2, 3, 4, 5];

const Rating: FC<PropsType> = (options) => {
  const { rating, fontSize, onClick } = options;
  return (
    <div className='star-block'>
      {numbers.map((number) => (
          <span
            key={number}
            className={`star-block__star ${onClick ? 'star-block__star_hover' : ''}`}
            onClick={() => onClick ? onClick(number) : ''}
          >
            {rating >= number
              ? <AiFillStar key={number} color='#FFC328' fontSize={fontSize}/>
              : <AiOutlineStar key={number} color='#FFC328' fontSize={fontSize}/>
            }
          </span>
        )
      )}
    </div>
  );
};

export default Rating;
