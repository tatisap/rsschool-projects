import { ICar } from '../types/types';

export default (form: HTMLFormElement): Omit<ICar, 'id'> => {
  return {
    name: form.text.value,
    color: form.color.value,
  };
};
