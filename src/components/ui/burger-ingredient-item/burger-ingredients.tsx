import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredient-item.module.css';
import { BurgerIngredientItemUIProps } from './type';
import { IngredientsGroup } from '@components';

export const BurgerIngredientItemUI: FC<BurgerIngredientItemUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          <IngredientsGroup
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
          />
          <IngredientsGroup
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
          />
          <IngredientsGroup
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
          />
        </div>
      </section>
    </>
  )
);
