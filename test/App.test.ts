import request from 'supertest';
import App from '../src/App';

const app = App.create();

it('should successfully create an App', function(done) {
  request(app)
    .get('/api/v1/activities')
    .expect(200)
    .end(done);
});
