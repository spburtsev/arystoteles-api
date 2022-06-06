import mongoose from 'mongoose';
import LocalizedString from '../../LocalizedString';
import AppLocale from '../../../enum/AppLocale';

class _LocalizedString extends mongoose.SchemaType {
  public constructor(key: any, options: any) {
    super(key, options, '_LocalizedString');
  }

  public cast(val: any) {
    let _val: LocalizedString = {
      [AppLocale.English]: '',
      [AppLocale.Ukrainian]: '',
    };

    for (const locale of Object.values(AppLocale) as string[]) {
      if (typeof val[locale] !== 'string') {
        throw new Error(`Locale ${locale} is not present in val: ${val}`);
      }
      _val[locale] = val[locale];
    }
    return _val;
  }
}
export default _LocalizedString;

mongoose.Schema.Types._LocalizedString = _LocalizedString;
