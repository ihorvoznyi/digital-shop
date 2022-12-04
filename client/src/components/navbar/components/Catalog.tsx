import { useEffect, useState, FC } from 'react'
import { useNavigate } from 'react-router-dom'

import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { IType } from '../../../store/general/interfaces';

import './styles/Catalog.scss';
import { generalStore } from '../../../store';

const Catalog = () => {

  const navigate = useNavigate();

  const [types, setTypes] = useState<IType[]>([]);

  const [isCatalog, setIsCatalog] = useState<boolean>(false);


  useEffect(() => {
    setTypes([...generalStore.getTypes()]);
  }, [])

  return (
    <div className='catalog' onClick={() => setIsCatalog((prev) => !prev)}>
      <div className='catalog__icons'>
        {isCatalog
          ? <CloseIcon />
          : <WidgetsOutlinedIcon />
        }
      </div>

      <p className='catalog__text'>Каталог</p>

      {isCatalog && (
        <ul className='catalog__list'>


          {types.map((type) => {
            const products = type.products;
            const isSubmenu = products.length ? true : false;

            return (
              <li className='catalog__field'>
                <span>{type.name}</span>
                {isSubmenu
                  ? (
                    <ul className='catalog__submenu'>
                      {products.map((product) => (
                        <li className='catalog__field'>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  )
                  : ''}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Catalog