import { Car } from '../types/types';

export default (form: HTMLFormElement): Omit<Car, 'id'> => {
  return {
    name: form.text.value,
    color: form.color.value,
  };
};
