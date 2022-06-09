import mongoose from 'mongoose';
import AppLocale from '../../../enum/AppLocale';
import Option from '../../Option';

class _OptionList extends mongoose.SchemaType {
  public constructor(key: any, options: any) {
    super(key, options, '_ScreeningQuestonOptions');
  }

  public cast(val: any) {
    const options: Array<Option> = [];

    for (const option of val) {
      if (typeof option.value !== 'number') {
        throw new Error(`Option.value is not present in val: ${val}`);
      }
      let _option: Option;
      _option.value = option.value;
      _option.text = {
        [AppLocale.English]: '',
        [AppLocale.Ukrainian]: '',
      };
      for (const locale of Object.values(AppLocale) as string[]) {
        if (typeof val.text[locale] !== 'string') {
          throw new Error(
            `Locale ${locale} is not present in val: ${val.text}`,
          );
        }
        _option.text[locale] = option.text[locale];
      }
      options.push(_option);
    }
    return options;
  }
}
export default _OptionList;

mongoose.Schema.Types._OptionList = _OptionList;
