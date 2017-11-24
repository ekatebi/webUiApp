import expect from 'expect';
import { link, serverPath } from '../../src/constant/app'; 

describe('constants', () => {

  describe('app', () => {

    it('should return correct url', () => {
      const url = 'hey';
      expect(link(url)).toBe(`${serverPath}/${url}`);
    });

    it('should return correct url + id', () => {
      const url = 'hey';
      const id = 'id';
      expect(link(url, id)).toBe(`${serverPath}/${url}/${id}`);
    });

  });


});


