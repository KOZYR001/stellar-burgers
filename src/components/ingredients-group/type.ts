import { TIngredient } from '@utils-types';

export type TIngredientsGroupProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
};
