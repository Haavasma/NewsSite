// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from "react-simplified";
import { Bruker, brukerStore, Sak } from "../../Stores";
import { LoginCard } from "./components/loginCard";
import { Button, Card, Alert } from '../../widgets';
import { createHashHistory } from 'history';
var history = createHashHistory();

export class Login extends Component{
    bruker: Bruker = new Bruker();
    render(){
        return (
            <Card width = "50%">
            <form>
              <div className="form-group">
                <label for="Brukernavn">Brukernavn: </label>
                <input type="text" 
                className="form-control" 
                aria-describedby="emailHelp" 
                placeholder="Skriv inn brukernavn"
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.bruker.brukernavn = event.target.value)}
                />
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Passord: </label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Passord" 
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.bruker.passord = event.target.value)}/>
              </div>
              <Button.Primary onClick={this.login}>Logg inn</Button.Primary>
            </form>
            </Card>
        )
    }
    login(){
      console.log("brukernavn: "+this.bruker.brukernavn+", passord: "+ this.bruker.passord);
        brukerStore.logIn(this.bruker.brukernavn, this.bruker.passord).then(e=>{
          Alert.success("Du er logget inn");
          history.push("/");
        }).catch((error:Error)=>Alert.danger(error.message));
    }

    mounted(){

    }
}