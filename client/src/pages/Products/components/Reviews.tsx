import './styles/Reviews.scss';
import { FC, FormEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { addReviewType, commentType } from '../../../store/product/interfaces';
import { userStore } from '../../../store';
import { useLocation } from 'react-router-dom';
import { Rating } from '../../../components';
import { addReview } from '../../../store/product/ProductService';

interface PropsType {
  reviews: commentType[];
}

const Reviews: FC<PropsType> = ({ reviews }) => {
  const productId = useLocation().pathname.split('/').slice(-1)[0];

  const [newReview, setNewReview] = useState<addReviewType>({
    userId: userStore.user.id,
    productId,
    estimate: 0,
    comment: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newReview.estimate === 0) return;

    addReview(newReview).then(() => window.location.reload());
  }

  const handleClickEstimate = (estimate: number) => {
    setNewReview(prev => ({ ...prev, estimate }));
  }

  return (
    <div className='product-reviews'>
      <h3 className='product-reviews__title'>Відгуки</h3>

      <div className='product-reviews__list'>
        {reviews.length
          ? reviews.map((review) => (
            <div className='product-reviews__review'>
              <div className='product-reviews__review-author'>
                {review.author}
              </div>

              <div className='product-reviews__review-estimate'>
                <Rating rating={review.estimate} fontSize={'24px'}/>
              </div>

              <p className='product-reviews__review-comment'>
                {review.comment}
              </p>
            </div>))
          : <span className='product-reviews__no-reviews'>Відгуків немає</span>}
      </div>

      {userStore.isAuth && (
        <div className='product-reviews__add-review'>
          <h3>Ваша думка важлива для нас</h3>

          <form className='product-reviews__review-form' onSubmit={handleSubmit}>
            <div className='product-reviews__add-estimate'>
            <span>
              Оцінка
            </span>
              <Rating rating={newReview.estimate} fontSize={'24px'} onClick={handleClickEstimate}/>
            </div>

            <div className='product-reviews__add-comment'>
              <textarea
                placeholder={'Напишіть Ваш відгук про даний товар'}
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              />
            </div>

            <button className='product-reviews__add-btn' type='submit'>
              <span>Відправити</span>
            </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default observer(Reviews);
