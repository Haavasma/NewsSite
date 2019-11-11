// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from "react-simplified";
import { Bruker, brukerStore, Sak } from "./../../Stores";
import { Button, Card, Alert, Column, Row } from '../../widgets';
import {LoginCard, FormGroup} from './components/LoginCard';
import { createHashHistory } from 'history';
var history = createHashHistory();

export class Login extends Component{
    bruker: Bruker = new Bruker();
    registrer: boolean = false;
    gjentatt: string = "";
    render(){
      if(!this.registrer){
        return (
          <LoginCard bruker = {this.bruker}>
            <Row>
              <Column width = {2}>
            <Button.Primary onClick={this.login}>Logg inn</Button.Primary>
            </Column>
            <Column width = {2}>
            <Button.Primary onClick={this.registrerTrue}>Registrer</Button.Primary>
            </Column>
            </Row>
          </LoginCard>
        )
      }else{
        return (
          <LoginCard bruker = {this.bruker}>
            <FormGroup type = "password" placeholder = "gjenta" text = "Gjenta passord" 
            onChange= {(event: SyntheticInputEvent<HTMLInputElement>) => {this.gjentatt = event.target.value}}></FormGroup>
            <Button.Success onClick = {this.registrerBruker}>Registrer</Button.Success>
          </LoginCard>
        )
      }
    }
    login(){
      console.log("brukernavn: "+this.bruker.brukernavn+", passord: "+ this.bruker.passord);
        brukerStore.logIn(this.bruker.brukernavn, this.bruker.passord).then(e=>{
          Alert.success("Du er logget inn");
          history.push("/");
        }).catch((error:Error)=>Alert.danger("Brukernavn eller passord er feil"));
    }
    registrerTrue(){
      this.registrer = true;
    }
    registrerBruker(){
      if(this.gjentatt==this.bruker.passord){
      console.log("brukernavn: "+ this.bruker.brukernavn+", passord: "+ this.bruker.passord);
      brukerStore.addBruker(this.bruker.brukernavn, this.bruker.passord).then(e=>{
        Alert.success("Du ble registrert");
        this.registrer=false;
      }).catch((error:Error)=>Alert.danger("brukernavn opptatt"))
      }else{
        Alert.danger("Passord er ulike");
      }
    }
}