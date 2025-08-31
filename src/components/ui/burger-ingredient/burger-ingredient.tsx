import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { image, price, name, _id, type } = ingredient; // Убедимся, что type доступен
    const ingredientData = JSON.stringify(ingredient); // Явная сериализация

    return (
      <li
        className={styles.container}
        data-cy='ingredient'
        data-ingredient={ingredientData}
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          data-ingredient={ingredientData} // Используем сериализованные данные
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
