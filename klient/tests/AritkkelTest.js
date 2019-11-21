//@flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { shallow, mount } from 'enzyme';
import {Bruker, BrukerStore} from '../src/Stores'
import axios from 'axios';

jest.mock('axios');

test('should fetch users', () => {
  const bruker: Bruker[] = [{brukernavn: 'Håvard', passord: 'secret'}];
  const resp = {data: bruker};
  axios.get.mockResolvedValue(resp);

  return BrukerStore.getBruker().then(data=>expect(data).toEqual(bruker));

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))
});