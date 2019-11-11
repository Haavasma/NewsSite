// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import {LiveFeed} from './../LiveFeed/index';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore, brukerStore } from './../../Stores.js';


export class Bruker extends Component <{ match: { params: { brukernavn: string } } }>{
  render() {
    if (sakStore.saker) {
      let tempSak: Sak[] = [];
      let counter: number = 0;
      tempSak = sakStore.saker;
      tempSak = tempSak.filter(e => e.brukernavn  == this.props.match.params.brukernavn);
      return (
        <div>
          <LiveFeed></LiveFeed>
          {tempSak.map(e => (
            <NavLink key={e.sak_id} to={"/Artikkel/" + e.sak_id}>
              <Card title={e.overskrift} image={e.bilde}>
                <div className="card-footer text-muted">
                  {e.tidspunkt}
                </div>
              </Card>
            </NavLink>
          )
          )}
        </div>
      );
    }
    else {
      return <div>laster...</div>
    }
  }
  mounted() {
    sakStore.getSaker().catch((error: Error) => Alert.danger(error.message));
  }
}