import { TIngredient } from '@utils-types';

export type TIngredientsGroupUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
};
