import { Notify } from 'notiflix';

export const showMessage = ({ type, message }) => {
  Notify[type](message);
};
