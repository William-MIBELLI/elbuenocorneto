import { CategoriesType } from '@/interfaces/IProducts'
import React, { FC } from 'react'
import Vehicule from './_vehicule'
import Immobilier from './_immobilier'

interface IProps {
  categoryType: CategoriesType
}
const CriteriaForm: FC<IProps> = ({ categoryType }) => {
  switch (categoryType) {
    case 'vehicule':
      return <Vehicule />
    case 'immobilier':
      return <Immobilier />
    default:
      return <div>
        Formulaire par défault.
      </div>
  }
}

export default CriteriaForm