import mongoose from 'mongoose';
import Expectation from '../../Expectation';

class _Expectation extends mongoose.SchemaType {
  public constructor(key: any, options: any) {
    super(key, options, '_ScreeningQuestonOptions');
  }

  public cast(val: any) {
    let _val: Expectation = {
      value: null,
      ageGroup: null,
    };

    if (typeof val.value !== 'number') {
      throw new Error(`'value' attribute is not present in val: ${val}`);
    }
    _val.value = val.value;
    if (typeof val.ageGroup !== 'number') {
      throw new Error(`'ageGroup' attribute is not present in val: ${val}`);
    }
    _val.ageGroup = val.ageGroup;

    return _val;
  }
}
export default _Expectation;

mongoose.Schema.Types._Expectation = _Expectation;
