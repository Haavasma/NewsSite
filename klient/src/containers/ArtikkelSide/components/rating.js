// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { ratingStore, Rating, brukerStore } from './../../../Stores'
import { Row, Column } from "../../../widgets";
import { FormGroup } from "../../LogIn/components/LoginCard";


export class Ratingcomponent extends Component<{sak_id: number}>{
    rating: Rating;
    render() {
        if (ratingStore.currentRating) {
            if (brukerStore.bruker) {
                return (
                    <div>
                        <Row>
                            <Column width={2}>
                                Rating:
                            </Column>
                            <Column width={2}>
                                {ratingStore.currentRating}
                            </Column>
                        </Row>
                        <Row>
                            <Column width={2}>
                                Rate:
                            </Column>
                        </Row>
                    </div>
                );
            }
        }
    }
    mounted() {
        ratingStore.getRating(this.props.sak_id);
        this.rating.rating= 10;
    }
}