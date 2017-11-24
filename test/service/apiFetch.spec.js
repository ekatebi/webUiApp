import expect from 'expect';
import fetchMock from 'fetch-mock';
import authOptions from '../../src/service/auth';
import apiFetch from '../../src/service/apiFetch';
import { serverPath } from '../../src/constant/app';

describe('Services', () => {

  describe('apiFetch', () => {

    afterEach(() => fetchMock.restore());

    it('should pretend to be Rambo', (done) => {
      const url = `${serverPath}/Rambo`;
      fetchMock.mock(url, 201);
      apiFetch('Rambo')
      .then(resp => {
        expect(fetchMock.calls(url).length).toBe(1);
        expect(resp.status).toBe(201);
        done();
      });
    });

    // Chrome bug: Unable to construct a null body Response with status 204
    xit('should respond with no content', (done) => {
      const url = `${serverPath}/Rambo`;
      fetchMock.mock(url, 204);
      apiFetch('Rambo')
      .catch(error => {
        expect(fetchMock.calls(url).length).toBe(1);
        expect(error.response.status).toBe(204);
        done();
      });
    });

    it('should mock response', (done) => {
      const token = 'some token';
      const url = `${serverPath}/login`;
      fetchMock.mock(url, 'post', { body: { token }, status: 200 });
      apiFetch('login', authOptions('Joe', 'Shmoe'))
      .then(resp => resp.json())
      .then(json => {
        expect(fetchMock.calls(url).length).toBe(1);
        expect(json.token).toBe(token);
        done();
      });
    });

  });
});
