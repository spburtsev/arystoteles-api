import AppLocale, { appLocales } from '../enum/AppLocale';
import * as mongoose from 'mongoose';

export default interface LocalizedContent<T> {
  locale: AppLocale;
  content: T;
}

export type LocalizedString = {
  [key in AppLocale]: string;
};

export class LocalizedStringSchemaType extends mongoose.SchemaType {
  constructor(key: any, options: any) {
    super(key, options, 'LocalizedStringSchemaType');
  }

  public cast(val: any) {
    let _val: LocalizedString;

    for (const locale of appLocales) {
      if (typeof val[locale] !== 'string') {
        throw new Error(`Locale ${locale} is not present in val: ${val}`);
      }
      _val[locale] = val[locale];
    }
    return _val;
  }
}
mongoose.Schema.Types.LocalizedStringSchemaType = LocalizedStringSchemaType;
