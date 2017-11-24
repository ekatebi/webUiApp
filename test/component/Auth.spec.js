import expect from 'expect';
import React from 'react';
import TestUtils, { isCompositeComponent } from 'react-addons-test-utils';
import Auth from '../../src/component/Auth';
import { shallowRender } from '../helpers';
import { Modal } from 'react-bootstrap';


function setup(props) {
  const actions = {
    onSignIn: expect.createSpy(),
    onSignOut: expect.createSpy(),
    onHideModal: expect.createSpy(),
    onReadToken: expect.createSpy(),
    onRequestToken: expect.createSpy()
  };
  const component = TestUtils.renderIntoDocument(
      <Auth fetching={props.fetching} showModal={props.showModal}
        token={props.token} {...actions} />
    );
  return {
    component,
    actions,
    loginButton: TestUtils.findRenderedDOMComponentWithClass(component, 'loginButton'),
    modals: TestUtils.scryRenderedComponentsWithType(component, Modal)
  };
}

describe('Components', () => {

  describe('Auth', () => {

    it('should display SignIn button', () => {
      const { loginButton, actions, modals } =
        setup({ fetching: false, showModal: false, token: false });
      expect(loginButton.textContent).toMatch(/^Sign In$/);
      TestUtils.Simulate.click(loginButton);
      expect(actions.onSignIn).toHaveBeenCalled();
      expect(modals.length).toBe(0);
    });

    it('should display SignOut button', () => {
      const { loginButton, actions, modals } =
        setup({ fetching: false, showModal: true, token: true });
      expect(loginButton.textContent).toMatch(/^Sign Out$/);
      TestUtils.Simulate.click(loginButton);
      expect(actions.onSignOut).toHaveBeenCalled();
      expect(isCompositeComponent(modals[0])).toBe(true);
      expect(modals.length).toBe(1);
    });

    it('should display Modal', () => {
      const actions = {
        onSignIn: expect.createSpy(),
        onSignOut: expect.createSpy(),
        onHideModal: expect.createSpy(),
        onReadToken: expect.createSpy(),
        onRequestToken: expect.createSpy()
      };
      const subject = shallowRender(<Auth showModal { ...actions } />);
      const subjectStr = JSON.stringify(subject.props.children);
      expect(subjectStr.indexOf('form')).toNotEqual(-1);
      expect(subjectStr.indexOf('modal')).toNotEqual(-1);
      // console.log(renderToString(subject));
    });

    it('should not display Modal', () => {
      const actions = {
        onSignIn: expect.createSpy(),
        onSignOut: expect.createSpy(),
        onHideModal: expect.createSpy(),
        onReadToken: expect.createSpy(),
        onRequestToken: expect.createSpy()
      };
      const subject = shallowRender(<Auth fetching={false}
        showModal={false} token={false} {...actions} />);
      const subjectStr = JSON.stringify(subject.props.children);
      expect(subjectStr.indexOf('form')).toEqual(-1);
      expect(subjectStr.indexOf('modal-footer')).toEqual(-1);
    });

  });
});
