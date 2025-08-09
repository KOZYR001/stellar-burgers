import { FC, memo } from 'react';
import { BurgerConstructorItemUI } from '@ui';
import { BurgerConstructorItemProps } from './type';
import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '@slices/constructorSlice';
import { useDispatch } from '@store';

export const BurgerConstructorItem: FC<BurgerConstructorItemProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorItemUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
