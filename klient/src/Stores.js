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

export class Sak {
    sak_id: number = 0;
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


class SakStore {
    saker: Sak[]
    currentSak: Sak = new Sak();

    getSaker(){
        return axios.get<Sak[]>('/api/nyheter').then(response=>(this.saker = response.data));
    }
    getViktigeSaker(){
        return axios.get<Sak[]>('/api/viktigeNyheter').then(response=>(this.saker = response.data)).catch((error:Error)=>Alert.danger(error.message));
    }
    getSak(id: number){
        return axios.get<Sak>('/api/nyheter/'+ id).then(response =>{
            this.currentSak = response.data[0];
            console.log(response.data);
            let sak = this.saker.find(sak=>sak.sak_id==this.currentSak.sak_id);
            if(sak) Object.assign(sak, {...this.currentSak});
            else{console.log("couldn't assign currentSak");}
        });
    }
    updateSak(){
        return axios.put('/api/nyheter/'+this.currentSak.sak_id, {
            overskrift: this.currentSak.overskrift,
            innhold: this.currentSak.innhold,
            tidspunkt: this.currentSak.tidspunkt,
            bilde: this.currentSak.bilde,
            kategori: this.currentSak.kategori,
            viktighet: this.currentSak.viktighet
        }).then(()=>{
            let sak = this.saker.find(sak=>sak.sak_id==this.currentSak.sak_id);
            if(sak)Object.assign(sak, {...this.currentSak });
        });
    }
    addSak(sak: Sak){
        return axios.post('/api/nyheter', {
            overskrift: sak.overskrift,
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
        return axios.delete('/api/nyheter/',{data: {
            "sak_id": id,
        }}).then(response=>{
            console.log(response);
        })
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
export let sakStore = sharedComponentData(new SakStore());
export let kommentarStore = sharedComponentData(new KommentarStore());
export let kategoriStore = sharedComponentData(new KategoriStore());
kategoriStore.getKategorier().then(e=>{console.log(kategoriStore.kategorier)});
kommentarStore.getKommentarer(2).then(e=>{console.log(kommentarStore.kommentarer)});
sakStore.getViktigeSaker().then(e=>{console.log(sakStore.saker)});
sakStore.getSak(2).then(e=>console.log(sakStore.currentSak.overskrift));
//console.log(sakStore.saker);