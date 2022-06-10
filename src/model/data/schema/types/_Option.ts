import mongoose from 'mongoose';
import AppLocale from '../../../enum/AppLocale';
import Option from '../../Option';

class _Option extends mongoose.SchemaType {
  public constructor(key: any, options: any) {
    super(key, options, '_ScreeningQuestonOptions');
  }

  public cast(val: any) {
    let _val: Option = {
      value: null,
      text: {
        [AppLocale.English]: null,
        [AppLocale.Ukrainian]: null,
      },
    };

    if (typeof val.value !== 'number') {
      throw new Error(`'value' attribute is not present in val: ${val}`);
    }
    _val.value = val.value;
    for (const locale of Object.values(AppLocale) as string[]) {
      if (typeof val.text[locale] !== 'string') {
        throw new Error(`Locale ${locale} is not present in val: ${val.text}`);
      }
      _val.text[locale] = val.text[locale];
    }

    return _val;
  }
}
export default _Option;

mongoose.Schema.Types._Option = _Option;
