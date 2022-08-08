import { NO_CONTENT } from '../../constants/constants';

export default (
  type: string,
  className: string,
  name: string,
  placeholder: string = NO_CONTENT
): HTMLInputElement => {
  const input: HTMLInputElement = document.createElement('input');
  input.type = type;
  input.name = name;
  input.classList.add(className);
  if (type === 'text') {
    input.placeholder = placeholder;
    input.setAttribute('autocomplete', 'off');
  }
  return input;
};
