// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import {Card} from './../../../widgets';

export class LoginCard extends Component<{ brukernavn: React.Node, passord: React.Node, width: Number }> {
  render() {
    return (
      <Card width = "40%">
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">{this.props.brukernavn}</label>
          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Skriv inn brukernavn" />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">{this.props.passord}</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      </Card>
    );
  }
}