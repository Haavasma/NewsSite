// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore, brukerStore } from './../../Stores.js';

export class Menu extends Component {
  render() {
    if (kategoriStore.kategorier) {
      if(brukerStore.bruker){
        return (
          <NavBar brand="NyhetsSide">
          {kategoriStore.kategorier.map(e => (
            <NavBar.Link key={e.kategori} to={"/kategori/" + e.kategori}>{e.kategori}</NavBar.Link>
          ))}
          <NavBar.Link to={"/bruker/"+brukerStore.bruker.brukernavn}><b>Mine Artikler</b></NavBar.Link>
          <NavLink to="/RegistreringsSide"><Button.Success>Legg til artikkel</Button.Success></NavLink>
          <NavLink to="/login"><Button.Danger>Logg ut</Button.Danger></NavLink>
        </NavBar>
        )
      }else{
        console.log("Loading not logged in" +brukerStore.bruker);
        return (
          <NavBar brand="NyhetsSide">
            {kategoriStore.kategorier.map(e => (
              <NavBar.Link key={e.kategori} to={"/kategori/" + e.kategori}>{e.kategori}</NavBar.Link>
            ))}
            <NavLink to="/login"><Button.Success>Logg inn</Button.Success></NavLink>
          </NavBar>
  
        );
      }
    } else {
      return <div></div>
    }
  }
  mounted() {
    kategoriStore.getKategorier();
  }
}