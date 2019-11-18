// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore } from './../../Stores.js';


export class LiveFeed extends Component {
    render() {
      if (sakStore.saker) {
        return (
          <div>
            <marquee behavior="scroll" direction="left">
              {sakStore.saker.map(e => (
                <NavLink key={e.sak_id} exact to={"/Artikkel/" + e.sak_id}>
                  {e.overskrift + ": " + e.tidspunkt + ", "}
                </NavLink>
              ))}
            </marquee>
          </div>
        )
      } else {
        return <div>laster...</div>
      }
    }
    mounted() {
      sakStore.getSaker().catch((error: Error) => Alert.danger(error.message));
    }
}