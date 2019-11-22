//@flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow, mount } from 'enzyme';
import {Alert, Card} from '../src/widgets';
import {LiveFeed} from '../src/containers/LiveFeed';
import { Sak, Rating, Bruker } from '../src/Stores';
import { Ratingcomponent } from '../src/containers/ArtikkelSide/components/rating';
import { Login } from '../src/containers/LogIn/index';


describe('Alert tests', () => {
  const wrapper = shallow(<Alert />);

  it('initially', () => {
    let instance = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });

  it('after danger', done => {
    Alert.danger('test');

    setTimeout(() => {
      let instance = Alert.instance();
      expect(typeof instance).toEqual('object');
      if (instance) expect(instance.alerts).toEqual([{ id: 0, text: 'test', type: 'danger' }]);

      expect(wrapper.find('button.close')).toHaveLength(1);

      done();
    });
  });

  it('after clicking close button', () => {
    wrapper.find('button.close').simulate('click');

    let instance = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });


});

describe('Card tests', ()=>{
  const wrapper= shallow(<Card title = "tittel">hallo</Card>);

  it('renders title', () => {
    let instance = Card.instance();
    expect(typeof instance).toEqual('object');

    expect(wrapper.find('h5.card-title').text()).toEqual("tittel");
  });

  it('renders children', ()=>{
    let instance = Card.instance();
    expect(typeof instance).toEqual('object');
    expect(wrapper.find('div.card-text').text()).toEqual("hallo");
  })
});

describe('livefeed test', ()=>{
  const wrapper = shallow(<LiveFeed></LiveFeed>);
  let sak: Sak = new Sak();
  sak.overskrift = "overskrift";
  sak.tidspunkt = "klokka2";
  let saker: Sak[] = [sak];
  it('renders articleText', ()=>{
    let instance = LiveFeed.instance();
    if(instance){
    instance.saker = saker;
    }
    expect(wrapper.find('NavLink').text()).toEqual(" (" +sak.overskrift + ": " + sak.tidspunkt + ").    .");
  });
});
/*
describe('login test', ()=>{
  const wrapper: ShallowWrapper = shallow(<Login></Login>);
  
  it('renders loginButton', ()=>{
    let instance: Login = Login.instance();
    expect(wrapper.find('label').text()).toEqual("brukernavn");
  });
});
*/