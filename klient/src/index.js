import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './widgets';
import {LagArtikkel} from './containers/lagArtikkel/index';
import {LiveFeed} from './containers/LiveFeed/index';
import {Home} from './containers/Home/index';
import  {Menu} from './containers/Menu/index';
import {ArtikkelSide} from './containers/ArtikkelSide/index';
import {ArtikkelEdit} from './containers/ArtikkelEdit/index';
import {Kategori} from './containers/Kategori/index';
import {Login} from './containers/LogIn/index';
import {Bruker} from './containers/Bruker/index';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore , brukerStore} from './Stores';
const history = createHashHistory();


const root = document.getElementById('root');

if (root) ReactDOM.render(
  <HashRouter>
    <div>
      <Alert></Alert>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/kategori/:kategori" component={Kategori} />
      <Route exact path="/Artikkel/:sak_id" component={ArtikkelSide} />
      <Route exact path="/RegistreringsSide" component={LagArtikkel} />
      <Route exact path="/ArtikkelEdit/:sak_id" component={ArtikkelEdit} />
      <Route exact path="/login" component={Login}/>
      <Route exact path="/bruker/:brukernavn" component = {Bruker}/>
    </div>
  </HashRouter>,
  root
);
brukerStore.autoLogin();