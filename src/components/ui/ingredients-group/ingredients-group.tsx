import styles from './ingredients-group.module.css';
import { forwardRef } from 'react';
import { TIngredientsGroupUIProps } from './type';
import { BurgerIngredient } from '@components';

export const IngredientsGroupUI = forwardRef<
  HTMLUListElement,
  TIngredientsGroupUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => (
  <>
    <h3 className='text text_type_main-medium mt-10 mb-6' ref={titleRef}>
      {title}
    </h3>
    <ul className={styles.items} ref={ref}>
      {ingredients.map((ingredient) => (
        <BurgerIngredient
          ingredient={ingredient}
          key={ingredient._id}
          count={ingredientsCounters[ingredient._id]}
        />
      ))}
    </ul>
  </>
));
