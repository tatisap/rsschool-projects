import { FormType, ListenerInfo } from '../../types/types';
import createActionButton from './create-action-button';
import { createParentUIElement } from './create-general-element';
import createInput from './create-input';

export default (formType: FormType, listenerInfo?: ListenerInfo): HTMLFormElement =>
  createParentUIElement<HTMLFormElement>({
    tag: 'form',
    classNames: ['form', `${formType}-form`],
    children: [
      createInput(
        'text',
        'form__text-input',
        'text',
        formType === 'create' ? 'Enter car name' : 'Select car to update'
      ),
      createInput('color', 'form__color-input', 'color'),
      createActionButton(formType),
    ],
    listenerInfo,
  });
