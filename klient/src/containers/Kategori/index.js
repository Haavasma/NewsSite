// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';
import {LiveFeed} from './../LiveFeed/index';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore } from './../../Stores.js';
const history = createHashHistory();


export class Kategori extends Component<{ match: { params: { kategori: string } } }>{
    render() {
      if (sakStore.saker) {
        let kategoriSaker: Sak[] = [];
        kategoriSaker = sakStore.saker;
        kategoriSaker = kategoriSaker.filter(e => (e.kategori == this.props.match.params.kategori));
        return (
          <div>
            {kategoriSaker.map(e => (
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
      return <div>laster...</div>
    }
    mounted() {
      sakStore.getSaker().catch((error: Error) => Alert.danger(error.message));
    }
  }