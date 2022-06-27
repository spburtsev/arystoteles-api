import { type Query } from "mongoose";
import type RequestQuery from "../types/request-query";
import { parseExtension } from "./functional";

class Extension<QueryResultT, DocT> {
  dbQuery: Query<QueryResultT, DocT> | Query<DocT[], DocT, {}, DocT>;
  requestQuery: RequestQuery;

  public constructor(dbQuery: Query<QueryResultT, DocT>, requestQuery: RequestQuery) {
    this.dbQuery = dbQuery;
    this.requestQuery = requestQuery;
  }

  public filter() {
    const queryObj = { ...this.requestQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|regex)\b/g, match => `$${match}`);

    this.dbQuery = this.dbQuery.find(JSON.parse(queryStr));
    return this;
  }

  public sort() {
    if (this.requestQuery.sort) {
      const sortBy = parseExtension(this.requestQuery.sort);
      this.dbQuery = this.dbQuery.sort(sortBy);
    } else {
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }

    return this;
  }

  public limitFields() {
    if (this.requestQuery.fields) {
      const fields = parseExtension(this.requestQuery.fields);
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      this.dbQuery = this.dbQuery.select('-__v');
    }

    return this;
  }

  public paginate() {
    const page = Number(this.requestQuery.page) || 1;
    const limit = Number(this.requestQuery.limit) || 100;
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    return this;
  }
}
export default Extension;