//@flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { ListGroup } from '../src/widgets';
import { shallow, mount } from 'enzyme';
import { Sak } from '../src/Stores';

var sak = new Sak();

describe('ListGroup test', ()=>{
    const wrapper = shallow(<ListGroup></ListGroup>);
});