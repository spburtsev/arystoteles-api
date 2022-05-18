import PropType from './prop-type';
import { type Request } from 'express';

type RequestQuery = PropType<Request, 'query'>;
export default RequestQuery;