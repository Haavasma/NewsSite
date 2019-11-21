// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { Route, NavLink } from 'react-router-dom';
import { Spinner } from './../../widgets';

import { createHashHistory } from 'history';
import { Sak } from './../../Stores.js';
import socketIOClient from 'socket.io-client';


export class LiveFeed extends Component {
  saker: Sak[] = [];
  socketURL: string = "http://localhost:4001";
 
  componentDidMount() {
    let socket = socketIOClient(this.socketURL);
    socket.on("livefeed", saker => {
      console.log("received saker from socket: " + saker[0].overskrift);
      this.saker = saker;
    });
  }
  render() {
    if (this.saker) {
      return (
        <marquee>
          {this.saker.map(e => (
            <NavLink key={e.sak_id} exact to={"/Artikkel/" + e.sak_id}>
              {" (" +e.overskrift + ": " + e.tidspunkt + ").    ."}
            </NavLink>
          ))}
         </marquee>
      )
    } else {
      return <Spinner></Spinner>
    }
  }
}