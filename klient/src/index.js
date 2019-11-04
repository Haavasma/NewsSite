import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, Card, NavBar, Button, Row, Column, ListGroup, ListGroupItem } from './widgets';

import { createHashHistory } from 'history';
import { sharedComponentData } from 'react-simplified';
import { Sak, sakStore, Kommentar, kommentarStore, kategoriStore } from './Stores';
const history = createHashHistory();

var categories: kategori[] = [];
kategoriStore.getKategorier().then(e => { categories = kategoriStore.kategorier });

let maksAntallViktigeSaker: number = 20;

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


class Menu extends Component {
  render() {
    if (kategoriStore.kategorier)
      return (
        <NavBar brand="NyhetsSide">
          {kategoriStore.kategorier.map(e => (
            <NavBar.Link key={e.sak_id} to={"/kategori/" + e.kategori}>{e.kategori}</NavBar.Link>
          ))}
          <NavBar.Link to="/RegistreringsSide">Legg til artikkel</NavBar.Link>
        </NavBar>

      ); else {
      return <div></div>
    }
  }
  mounted() {
    kategoriStore.getKategorier();
  }
}
class LiveFeed extends Component {
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
class Home extends Component {
  render() {
    if (sakStore.saker) {
      let tempSak: Sak[] = [];
      let counter: number = 0;
      tempSak = sakStore.saker;
      tempSak = tempSak.filter(e => e.viktighet == 1);
      tempSak = tempSak.filter(e => {
        counter++;
        return (counter < maksAntallViktigeSaker);
      })
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


class ArtikkelSide extends Component<{ match: { params: { sak_id: number } } }> {
  kommentar: Kommentar = new Kommentar();
  tempKommentar: string = "";
  tempBrukerNavn: string = "";
  render() {
    if (sakStore.currentSak.sak_id == this.props.match.params.sak_id && kommentarStore.kommentarer) return (
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
              <ListGroupItem key ={e.kommentar}>
                <h4>{e.brukernavn}</h4>
                {e.kommentar}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card>
      </div>
    );
    return <div>laster...</div>

  }
  comment() {
    this.kommentar.sak_id = this.props.match.params.sak_id;
    if (this.tempBrukerNavn == "") {
      this.tempBrukerNavn = "Anonyme Arne";
    }
    this.kommentar.kommentar = this.tempKommentar;
    this.kommentar.brukernavn = this.tempBrukerNavn;
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

class ArtikkelEdit extends Component<{ match: { params: { sak_id: number } } }>{
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
                  {categories.map(e => (
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
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (sakStore.currentSak.viktighet = event.target.checked)}
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
    sakStore.updateSak().catch((error:Error)=>Alert.danger(error.message));
    history.push("/");
    return;
  }
  mounted() {
    sakStore.getSak(this.props.match.params.sak_id).catch((error: Error) => Alert.danger(error.message));
  }
}

class kategori extends Component<{ match: { params: { kategori: string } } }>{
  render() {
    if (sakStore.saker) {
      let kategoriSaker: Sak[] = [];
      kategoriSaker = sakStore.saker;
      kategoriSaker = kategoriSaker.filter(e => (e.kategori == this.props.match.params.kategori));
      return (
        <div>
          <LiveFeed>
          </LiveFeed>
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

class LagArtikkel extends Component {
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
                  {categories.map(e => (
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
    this.sak.tidspunkt = nyTidspunkt();
    sakStore.saker.push(this.sak);
    sakStore.addSak(this.sak);
    sakStore.getSaker();
    history.push("/");
    return;
  }
  mounted() {
    sakStore.getSaker();
  }
}

const root = document.getElementById('root');

console.log("fra index.js: ");
console.log(sakStore.saker);
if (root) ReactDOM.render(
  <HashRouter>
    <div>
      <Alert></Alert>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/kategori/:kategori" component={kategori} />
      <Route exact path="/Artikkel/:sak_id" component={ArtikkelSide} />
      <Route exact path="/RegistreringsSide" component={LagArtikkel} />
      <Route exact path="/ArtikkelEdit/:sak_id" component={ArtikkelEdit} />
    </div>
  </HashRouter>,
  root
);
