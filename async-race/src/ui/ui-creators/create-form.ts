import { TEXT_INPUT_PLACEHOLDERS } from '../../constants/constants';
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
        formType === 'create'
          ? TEXT_INPUT_PLACEHOLDERS.createForm
          : TEXT_INPUT_PLACEHOLDERS.updateForm
      ),
      createInput('color', 'form__color-input', 'color'),
      createActionButton(formType),
    ],
    listenerInfo,
  });
