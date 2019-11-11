// @flow
import { sharedComponentData } from 'react-simplified';
import axios from 'axios';
import { Alert } from './widgets';

export class Kommentar{
    id: number = 0;
    kommentar: string = "";
    brukernavn: string = "";
    sak_id: number = 0;
}

export class Rating{
    rating_id: number = 0;
    rating: number = 0;
    sak_id: number = 0;
    brukernavn: string = "";
}

export class Sak {
    sak_id: number = 0;
    brukernavn: string = "";
    overskrift: string = "";
    innhold: string= "";
    tidspunkt:string= "";
    bilde: string= "";
    kategori: string= "";
    viktighet: number = 0;
}
export class Kategori {
    kategori: string = "";
}
export class Bruker {
    brukernavn: string = "";
    passord: string  = "";
}


class SakStore {
    saker: Sak[]
    currentSak: Sak = new Sak();

    getSaker(){
        return axios.get<Sak[]>('/api/nyheter').then(response=>(this.saker = response.data));
    }
    getSak(id: number){
        return axios.get<Sak>('/api/nyheter/'+ id).then(response =>{
            this.currentSak = response.data[0];
            console.log(response.data);
        });
    }
    updateSak(token: String){
        return axios({method: 'put', url: '/api/nyheter/'+this.currentSak.sak_id, 
            headers:{
                'x-access-token': localStorage.token
            },
            data: {
            overskrift: this.currentSak.overskrift,
            innhold: this.currentSak.innhold,
            tidspunkt: this.currentSak.tidspunkt,
            bilde: this.currentSak.bilde,
            kategori: this.currentSak.kategori,
            viktighet: this.currentSak.viktighet
        }}).then(response=>{
            if(response.data.jwt){
                localStorage.token = response.data.jwt;
            }
            let sak = this.saker.find(sak=>sak.sak_id==this.currentSak.sak_id);
            if(sak)Object.assign(sak, {...this.currentSak });
        });
    }
    addSak(sak: Sak){
        return axios.post('/api/nyheter', {
            overskrift: sak.overskrift,
            brukernavn: sak.brukernavn,
            innhold: sak.innhold,
            tidspunkt: sak.tidspunkt,
            bilde: sak.bilde,
            kategori: sak.kategori,
            viktighet: sak.viktighet
        }).then(response=>{
            console.log(response);  
        })
    }
    deleteSak(id: number){
        console.log("fra deleteSak, axios");
        console.log(id);

        return axios({method: 'delete', url: '/api/nyheter/',
    headers:{
        'x-access-token': localStorage.token
    }, data: {
        "sak_id": id,
    }}).then(response=>{
        if(response.data.jwt){
            localStorage.token = response.data.jwt;
        }
    })

        /*return axios.delete('/api/nyheter/', headers: {
            "x-access-token": localStorage.token
        },
        {data: {
            "sak_id": id,
        }}).then(response=>{
            if(response.data.jwt){
                localStorage.token = response.data.jwt;
            }
            console.log(response);
        })*/

    }
}
class KommentarStore{
    kommentarer: Kommentar[];

    getKommentarer(id:number){
        return axios.get<Kommentar[]>('/api/kommentar/'+id).then(response=>(this.kommentarer = response.data))
    }
    addKommentar(comment: Kommentar){
        return axios.post('/api/kommentar', {
            kommentar: comment.kommentar,
            brukernavn: comment.brukernavn,
            sak_id: comment.sak_id
        }).then(response=>{
            console.log(response);
        })
    }
}
class KategoriStore{
    kategorier: Kategori[];

    getKategorier(){
        return axios.get<Kategori[]>('/api/kategorier')
        .then(response=>this.kategorier=response.data);
    }
}

class BrukerStore{
    bruker: Bruker;

    autoLogin(){
        if(localStorage.token){
            console.log("token from store: "+ localStorage.token);
            return axios<Bruker>({
                method: 'post',
                url: '/token',
                headers: {
                    "x-access-token": localStorage.token
                }
              })
                .then(response=> {
                    if(response.data.jwt){
                    this.bruker = new Bruker();
                    this.bruker.brukernavn = response.data.brukernavn;
                    localStorage.token = response.data.jwt;
                    }
                    console.log(response);
              });
        }    
    }
    getBruker(brukernavn: string){
        return axios.get<Bruker>('/api/bruker', {
            brukernavn: brukernavn
        }).then(response=>{
            console.log(response);
        })
    }
    logIn(brukernavn: string, passord: string){
        return axios.post<Bruker>('/api/login', {
            brukernavn: brukernavn,
            passord: passord
        }).then(response=>{
            if(response.data.jwt){
                this.bruker = new Bruker();
                this.bruker.brukernavn = brukernavn;
                this.bruker.passord = passord;
                localStorage.token = response.data.jwt;
                console.log("token: "+ localStorage.token);
            }
            console.log(response);
        })
    }
    addBruker(brukernavn: string, passord: string){
        return axios.post<Bruker>('/api/bruker',{
            brukernavn:brukernavn,
            passord:passord
        }).then(response=>{
            console.log(response);
        }) 
    }
}

class RatingStore{
    ratings: Rating[];
    currentRating: number;

    getRating(sak_id: number){
        return axios.get<Rating>('/api/rating/'+sak_id)
        .then(response=>this.currentRating = response.data[0]);
    }
};

export let ratingStore = sharedComponentData(new RatingStore());
export let sakStore = sharedComponentData(new SakStore());
export let kommentarStore = sharedComponentData(new KommentarStore());
export let kategoriStore = sharedComponentData(new KategoriStore());
export let brukerStore = sharedComponentData(new BrukerStore());
sakStore.getSaker();
kategoriStore.getKategorier().then(e=>{console.log(kategoriStore.kategorier)});
kommentarStore.getKommentarer(2).then(e=>{console.log(kommentarStore.kommentarer)});
//sakStore.getSak(2).then(e=>console.log(sakStore.currentSak.overskrift));
//console.log(sakStore.saker);