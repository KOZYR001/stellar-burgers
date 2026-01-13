import { FC } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { Params, useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { getIngredientState } from '@slices/ingredientSlice';

export const IngredientDetails: FC = () => {
  const { ingredients, loading, error } = useSelector(getIngredientState);
  const { id } = useParams<Params>();

  const ingredientData = ingredients.find((i) => i._id === id);

  if (loading) return <Preloader />;
  if (error || !ingredientData) return <div>Ошибка загрузки ингредиента</div>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
