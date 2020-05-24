import React from 'react';
import './CardsGrid.css';
import Card from '../Card';
import { CardType, State } from '../interfaces';
import { createDateString } from '../../helpers/helper';
import { calculateTimeGap } from '../Display/Display';

const CardsGrid = ({ state, updateState }: State) => {
  const handleUpdate = (cardState: CardType, selectedItem?: string) => {
    const _state = { ...state };
    if (selectedItem) {
      //  Update only the selectedItem property
      _state.selectedItem === selectedItem
        ? (_state.selectedItem = '')
        : (_state.selectedItem = selectedItem);
    } else {
      // Update everything else
      cardState.dateString = createDateString(cardState);
      if (cardState.editMode) {
        _state.selectedItem = cardState.id;
        _state.items.forEach((e) =>
          e.id !== cardState.id ? (e.editMode = false) : null
        );
      }
      let deletedEl = -1;
      const mapped = _state.items.map((e, i) => {
        if (e.id === cardState.id) {
          if (cardState.title === 'DELETE') {
            deletedEl = i;
          } else {
            return cardState;
          }
        }

        return e;
      });
      if (deletedEl !== -1) {
        mapped.splice(deletedEl, 1);
      }
      _state.items = mapped;
    }
    updateState(_state);
  };
  const cardsArray = state?.items?.map((e) => {
    return <Card key={e.id} cardState={e} handleClick={handleUpdate} />;
  });
  // TODO: move this sort function somewhere else
  cardsArray?.sort((a, b): number => {
    const cA = calculateTimeGap(a.props.cardState);
    const cB = calculateTimeGap(b.props.cardState);
    if (cA > cB) return 1;
    if (cA < cB) return -1;
    return 0;
  });
  return <main className="CardsGrid">{cardsArray}</main>;
};
export default CardsGrid;
