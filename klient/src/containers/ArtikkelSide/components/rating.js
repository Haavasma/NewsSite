// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { ratingStore, Rating, brukerStore } from './../../../Stores'
import { Row, Column, Card, Button, Alert } from "../../../widgets";
//import { FormGroup } from "../../LogIn/components/LoginCard";
const minValue: number = 1;
const maxValue: number = 10;
var rateButton;
var rated: boolean = false;

export class Ratingcomponent extends Component<{ sak_id: number }>{
    rating: Rating = new Rating();
    render() {
        if (brukerStore.bruker) {
            rateButton = rated ? (<Button.Secondary onClick={e=>{console.log("");}}>Rate</Button.Secondary>) :
                (
                    <Button.Primary onClick={this.rate}>
                        Rate
                </Button.Primary>
                );

            return (
                <Card>
                    <Row>
                        <Column width={2}>
                            <b>Rating:</b>
                        </Column>
                        <Column width={3}>
                            {ratingStore.currentRating ? ratingStore.currentRating + "/" + maxValue : "ikke ratet enda"}
                        </Column>
                        <Column width={1}>
                            <input type="number" min={minValue} max={maxValue} id="myList" placeholder={minValue}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.rating.rating = event.target.value)}>
                            </input>
                        </Column>
                        <Column>
                            {rateButton}
                        </Column>
                    </Row>
                </Card>
            );
        }
        return (
            <Card>
                <Row height={2}>
                    <Column width={2}>
                        <b>Rating:</b>
                    </Column>
                    <Column>
                        {ratingStore.currentRating ? ratingStore.currentRating + "/" + maxValue : "ikke ratet enda"}
                    </Column>
                </Row>
            </Card>
        );
    }
    rate() {
        this.rating.sak_id = this.props.sak_id;
        this.rating.brukernavn = brukerStore.bruker.brukernavn;
        rated = true;
        console.log("posting rating: " + this.rating.brukernavn);
        rateButton = "";
        ratingStore.addRating(this.rating)
            .then(e => { ratingStore.getRating(this.props.sak_id) })
            .catch((error: Error) => {
                Alert.danger("Artikkel allerede vurdert");
            });
    }
    mounted() {
        rated = false;
        ratingStore.getRating(this.props.sak_id);
        this.rating.rating = 1;
    }
}