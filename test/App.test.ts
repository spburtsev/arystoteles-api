import { Request, Response, NextFunction } from 'express';
import ActivityController from '../src/controller/ActivityController';
import request from 'supertest';
import App from '../src/App';

it('should successfully create an App and fetch activities', function(done) {
  const app = App.create();
  request(app)
    .get('/api/v1/activities')
    .expect(200)
    .end(done);
});

describe('Get all activities', () => {
  const app = App.create();
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction = () => {};
  let responseData: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockImplementation(data => {
        responseData = data;
      }),
    };
  });

  test('200 - activities', () => {
    ActivityController.getAllActivities(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(responseData.status).toBe(200);
    expect(responseData.data).toBeDefined();
  });
});
