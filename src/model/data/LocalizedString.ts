import AppLocale from '../enum/AppLocale';

type LocalizedString = {
  [key in AppLocale]: string;
};
export default LocalizedString;
