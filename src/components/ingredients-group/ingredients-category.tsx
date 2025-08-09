import { forwardRef, useMemo } from 'react';
import { TIngredientsGroupProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsGroupUI } from '@ui';
import { useSelector } from '@store';
import { getConstructorState } from '@slices/constructorSlice';

export const IngredientsGroup = forwardRef<
  HTMLUListElement,
  TIngredientsGroupProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorItems = useSelector(getConstructorState).constructorItems;

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = constructorItems;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [constructorItems]);

  return (
    <IngredientsGroupUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
