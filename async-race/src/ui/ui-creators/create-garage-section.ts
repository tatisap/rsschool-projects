import { createParentUIElement, createUIElement } from './create-general-element';
import * as handlers from '../../handlers/handlers';
import createForm from './create-form';
import createActionButton from './create-action-button';
import { Car, Info } from '../../types/types';
import { createPageNumberText, createSectionTitleText } from '../../utilities/text-makers';
import { SECTION_TITLE_TEXT } from '../../constants/constants';
import createCarUIElement from './create-car-ui-element';
import createPagination from './create-pagination';

const createGarageSectionHeader = (): HTMLDivElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['section__header'],
    children: [
      createForm('create', { eventName: 'submit', callback: handlers.createHandler }),
      createForm('update', { eventName: 'submit', callback: handlers.updateHandler }),
      createActionButton('race', { eventName: 'click', callback: handlers.raceHandler }),
      createActionButton('reset', { eventName: 'click', callback: handlers.resetRaceHandler }, [
        'disabled',
        'true',
      ]),
      createActionButton('generate', { eventName: 'click', callback: handlers.generateHandler }),
    ],
  });

export default (garageInfo: Info<Car>, pageNumber: number, maxPageNumber: number): HTMLElement =>
  createParentUIElement<HTMLElement>({
    tag: 'section',
    id: 'garage',
    classNames: ['section', 'section_visible'],
    children: [
      createGarageSectionHeader(),
      createUIElement<HTMLHeadingElement>({
        tag: 'h2',
        classNames: ['section__title', 'garage__title'],
        innerText: createSectionTitleText(SECTION_TITLE_TEXT.garage, garageInfo.totalAmount),
      }),
      createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['garage__page-number'],
        innerText: createPageNumberText(pageNumber),
      }),
      createParentUIElement<HTMLUListElement>({
        tag: 'ul',
        classNames: ['cars-list'],
        children: garageInfo.content.map(
          (carInfo: Car): HTMLLIElement => createCarUIElement(carInfo)
        ),
      }),
      createPagination(handlers.garagePaginationHandler, pageNumber, maxPageNumber),
    ],
    listenerInfo: { eventName: 'click', callback: handlers.controlsHandler },
  });
