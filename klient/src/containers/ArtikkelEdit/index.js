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
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore } from './../../Stores.js';
const history = createHashHistory();

export class ArtikkelEdit extends Component<{ match: { params: { sak_id: number } } }>{
    render() {
      if (sakStore.currentSak.sak_id == this.props.match.params.sak_id) {
        return (
          <Card title="Rediger artikkelen: ">
            <form>
              <Row>
                <Column>
                  <b><label for="overskrift">Overskrift: (*)</label></b>
                </Column>
              </Row>
              <Row>
                <Column>
                  <input id="overskriftInput"
                    name="overskrift"
                    type="text"
                    placeholder="Skriv inn overskrift her"
                    required
                    class="skalFyllesUt"
                    value={sakStore.currentSak.overskrift}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.overskrift = event.target.value)}>
                  </input>
                </Column>
              </Row>
              <Row>
                <Column>
                  <b><label for="bilde">Bilde: (*)</label></b>
                </Column>
              </Row>
              <Row>
                <Column>
                  <input
                    id="bildeInput"
                    name="bilde"
                    type="text"
                    placeholder="Url til bilde her"
                    required
                    class="skalFyllesUt"
                    value={sakStore.currentSak.bilde}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.bilde = event.target.value)}
                  >
                  </input>
                </Column>
              </Row>
              <Row>
                <Column>
                  <b><label>Kategori: </label></b>
                </Column>
              </Row>
              <Row>
                <Column>
                  <select id="myList"
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.kategori = event.target.value)}
                  >
                    {kategoriStore.kategorier.map(e => (
                      <option key ={e.kategori}>{e.kategori}</option>
                    ))}
                  </select>
                </Column>
              </Row>
              <Row>
                <Column width={1}>
                  <b><label for="viktighet">Viktig: </label></b>
                </Column>
                <Column width={2}>
                  <input id="viktighetInput"
                    name="viktighet"
                    type="checkbox"
                    required
                    value="viktig"
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.viktighet = event.target.checked?1:0)}
                    checked={sakStore.currentSak.viktighet}
                  ></input>
                </Column>
              </Row>
              <Row>
                <Column>
                  <b><label for="innhold">Innhold: (*)</label></b>
                </Column>
              </Row>
              <Row>
                <Column>
                  <textarea
                    rows="20"
                    id="innholdInput"
                    name="innhold"
                    type="text"
                    placeholder="Skriv artikkelens innhold her"
                    required
                    class="skalFyllesUt"
                    value={sakStore.currentSak.innhold}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.innhold = event.target.value)}
                  >
                  </textarea>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Button.Success onClick={this.changeArticle}>Rediger artikkel</Button.Success>
                </Column>
              </Row>
            </form>
          </Card>
        );
      }else{
        return <div>Laster...</div>
      }
    }
  
    changeArticle() {
      if (sakStore.currentSak.overskrift == "" || sakStore.currentSak.innhold == "" || sakStore.currentSak.bilde == "") {
        Alert.danger("de nødvendige feltene må fylles ut");
        return;
      }
    
      sakStore.updateSak().then(e=>{history.push("/")}).catch((error:Error)=>Alert.danger("Ikke autorisert"));
      return;
    }
    mounted() {
      sakStore.getSak(this.props.match.params.sak_id).catch((error: Error) => Alert.danger(error.message));
    }
  }