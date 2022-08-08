import { Car } from '../types/types';

export default (createForm: HTMLFormElement): Omit<Car, 'id'> => {
  return {
    name: createForm.text.value,
    color: createForm.color.value,
  };
};
