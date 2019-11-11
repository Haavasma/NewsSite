// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { LiveFeed } from './../LiveFeed/index';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './../../widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import {Ratingcomponent} from './components/rating';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore, brukerStore, Rating, ratingStore} from './../../Stores.js';
const history = createHashHistory();

export class ArtikkelSide extends Component<{ match: { params: { sak_id: number } } }> {
  kommentar: Kommentar = new Kommentar();
  tempKommentar: string = "";
  tempBrukerNavn: string = "";
  render() {
    if (sakStore.currentSak.sak_id == this.props.match.params.sak_id && kommentarStore.kommentarer) {
      if (brukerStore.bruker) {
        if (brukerStore.bruker.brukernavn == sakStore.currentSak.brukernavn) {
          return (
            <div>
              <Row>
                <Column width={1}>
                  <Button.Danger onClick={this.delete}>Slett artikkel</Button.Danger>
                </Column>
                <Column>
                  <NavLink to={"/ArtikkelEdit/" + this.props.match.params.sak_id}>
                    <Button.Success>Rediger artikkel</Button.Success>
                  </NavLink>
                </Column>
              </Row>
              <Card title={sakStore.currentSak.overskrift} image={sakStore.currentSak.bilde}>
                {sakStore.currentSak.innhold}
              </Card>
              <Card>
                <Row>
                  <Column>
                    <b><label>Kallenavn: </label></b>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <textarea rows="1" placeholder="Skriv kallenavn her" value={brukerStore.bruker.brukernavn} id="nickFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempBrukerNavn = event.target.value)}></textarea>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <b><label>Kommentar</label></b>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <textarea placeholder="Skriv kommentar her" value={this.tempKommentar} id="kommentarFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempKommentar = event.target.value)}></textarea>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Button.Success onClick={this.comment}>Kommenter</Button.Success>
                  </Column>
                </Row>
              </Card>
              <Card title="Kommentarer">
                <ListGroup>
                  {kommentarStore.kommentarer.map(e => (
                    <ListGroupItem key={e.kommentar}>
                      <h4>{e.brukernavn}</h4>
                      {e.kommentar}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card>
            </div>
          );
        }
        return (
            <div>
              <Card title={sakStore.currentSak.overskrift} image={sakStore.currentSak.bilde}>
                {sakStore.currentSak.innhold}
              </Card>
              <Card>
                <Row>
                  <Column>
                    <b><label>Kallenavn: </label></b>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <textarea rows="1" placeholder="Skriv kallenavn her" value={brukerStore.bruker.brukernavn} id="nickFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempBrukerNavn = event.target.value)}></textarea>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <b><label>Kommentar</label></b>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <textarea placeholder="Skriv kommentar her" value={this.tempKommentar} id="kommentarFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempKommentar = event.target.value)}></textarea>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Button.Success onClick={this.comment}>Kommenter</Button.Success>
                  </Column>
                </Row>
              </Card>
              <Card title="Kommentarer">
                <ListGroup>
                  {kommentarStore.kommentarer.map(e => (
                    <ListGroupItem key={e.kommentar}>
                      <h4>{e.brukernavn}</h4>
                      {e.kommentar}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card>
            </div>
          );
      }
      return (
        <div>
          <Card title={sakStore.currentSak.overskrift} image={sakStore.currentSak.bilde}>
            {sakStore.currentSak.innhold}
          </Card>
          <Card>
            <Row>
              <Column>
                <b><label>Kallenavn</label></b>
              </Column>
            </Row>
            <Row>
              <Column>
                <textarea rows="1" placeholder="Skriv kallenavn her" value={this.tempBrukerNavn} id="nickFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempBrukerNavn = event.target.value)}></textarea>
              </Column>
            </Row>
            <Row>
              <Column>
                <b><label>Kommentar</label></b>
              </Column>
            </Row>
            <Row>
              <Column>
                <textarea placeholder="Skriv kommentar her" value={this.tempKommentar} id="kommentarFelt" type="text" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.tempKommentar = event.target.value)}></textarea>
              </Column>
            </Row>
            <Row>
              <Column>
                <Button.Success onClick={this.comment}>Kommenter</Button.Success>
              </Column>
            </Row>
          </Card>
          <Card title="Kommentarer">
            <ListGroup>
              {kommentarStore.kommentarer.map(e => (
                <ListGroupItem key={e.kommentar}>
                  <h4>{e.brukernavn}</h4>
                  {e.kommentar}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Card>
        </div>
      );
    }
    return <div>laster...</div>

  }
  comment() {
    this.kommentar.sak_id = this.props.match.params.sak_id;
    if(brukerStore.bruker && this.tempBrukerNavn==""){
      this.kommentar.brukernavn = brukerStore.bruker.brukernavn;
    }else if (this.tempBrukerNavn == "") {
      this.tempBrukerNavn = "Anonyme Arne";
    }else{
      this.kommentar.brukernavn = this.tempBrukerNavn;
    }
    this.kommentar.kommentar = this.tempKommentar;
    this.tempBrukerNavn = "";
    this.tempKommentar = "";
    kommentarStore.kommentarer.push(this.kommentar);
    kommentarStore.addKommentar(this.kommentar)
      .then(this.kommentar = new Kommentar());
    return;
  }
  delete() {
    sakStore.saker = sakStore.saker.filter(e => (e.sak_id != this.props.match.params.sak_id));
    sakStore.deleteSak(this.props.match.params.sak_id).then(e => { console.log("slettet current sak") });
    Alert.success("Artikkel slettet");
    history.push("/");
  }
  mounted() {
    sakStore.getSak(this.props.match.params.sak_id).catch((error: Error) => Alert.danger(error.message));
    kommentarStore.getKommentarer(this.props.match.params.sak_id).catch((error: Error) => Alert.danger(error.message));
  }
}