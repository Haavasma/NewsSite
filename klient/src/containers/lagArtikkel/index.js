// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore, brukerStore} from './../../Stores.js';
import socketIOClient from 'socket.io-client';
const history = createHashHistory();


function nyTidspunkt() {
  var currentdate = new Date();
  var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  return datetime;
}

export class LagArtikkel extends Component {
    sak: Sak = new Sak();
    render() {
      if (kategoriStore.kategorier) {
        this.sak.kategori = kategoriStore.kategorier[0].kategori;
        return (
          <Card title="Lag en artikkel: ">
            <form>
              <Row>
                <Column>
                  <b><label>Overskrift: (*)</label></b>
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.overskrift = event.target.value)}>
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.bilde = event.target.value)}
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.kategori = event.target.value)}
                  >
                    {kategoriStore.kategorier.map(e => (
                      <option>{e.kategori}</option>
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
                    checked={this.viktighet}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.viktighet = event.target.checked)}
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
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.innhold = event.target.value)}
                  >
                  </textarea>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Button.Success onClick={this.makeArticle}>Legg til artikkel</Button.Success>
                </Column>
              </Row>
            </form>
          </Card>
        );
      }
      else {
        return <div>laster...</div>
      }
    }
    makeArticle() {
      if (this.sak.overskrift == "" || this.sak.innhold == "" || this.sak.bilde == "") {
        Alert.danger("de nødvendige feltene må fylles ut");
        return;
      }
      this.sak.brukernavn = brukerStore.bruker.brukernavn;
      this.sak.tidspunkt = nyTidspunkt();
      sakStore.saker.push(this.sak);
      sakStore.addSak(this.sak);
      sakStore.getSaker();
      history.push("/");
      return;
    }
    mounted() {
      kategoriStore.getKategorier();
      sakStore.getSaker();
    }
  }