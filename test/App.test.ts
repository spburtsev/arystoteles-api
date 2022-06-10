import request from 'supertest';
import App from '../src/App';

it('should successfully create an App and fetch activities', function(done) {
  const app = App.create();
  request(app)
    .get('/api/v1/activities')
    .expect(200)
    .end(done);
});
