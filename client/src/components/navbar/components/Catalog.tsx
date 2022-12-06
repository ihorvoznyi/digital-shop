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

  const handleNavigate = (type: IType) => {
    const id = type.id;
    const path = type.tag;

    generalStore.setCurrentType(id);
    navigate(path);
  };

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

            return (
              <li
                key={type.id}
                className='catalog__field'
                onClick={() => handleNavigate(type)}
              >
                <span>{type.name}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Catalog