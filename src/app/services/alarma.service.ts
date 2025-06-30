import { Injectable } from '@angular/core';
import { Alarma } from '../models/alarma';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {

  constructor() {
    this.alarmas = this.obtenerAlarmas() || []; // Recupero alarmas del localStorage y si no hay nada arranco vacío.

    this.guardarAlarmas(this.alarmas); // Guarado las alarmas.

    if(this.alarmas.length == 0){ // Si el array está vacío fijo el ID en 1
      this.nuevoId = 1 
    }
    else { // Si hay contenido, voy al último y fijo el ID en el último ID + 1
      let ultAlarma = this.alarmas[this.alarmas.length - 1];
      if(ultAlarma && ultAlarma.id !== undefined){
        this.nuevoId = ultAlarma.id + 1
      }
    }
   }

  alarmas: Alarma[] = [];
  private nuevoId: number = 0;

  obtenerAlarmas(): Alarma[] {
    let alarmasGuardadas = localStorage.getItem('alarmas');
    return this.alarmas = alarmasGuardadas ? JSON.parse(alarmasGuardadas) : [] // Si hay alarmas (porque las recuperó del localStorage) las parseo.
}

guardarAlarma(alarma: Alarma) {
  let alarmas = this.obtenerAlarmas();
  
  if(alarma.id != null && alarma.id !=0 && alarmas.some(a => a.id == alarma.id)){
    alarmas = alarmas.map(a => a.id == alarma.id ? alarma : a)
  }
  else {
    alarma.id = this.nuevoId++;
    alarmas.push(alarma)
  }
  this.guardarAlarmas(alarmas)
}

guardarAlarmas(alarmas: Alarma[]){
  localStorage.setItem('alarmas', JSON.stringify(alarmas))
}

eliminarAlarma(id:number){
  let alarmas = this.obtenerAlarmas(); // Obtengo las alarmas.

  alarmas = alarmas.filter((alarma)=> alarma.id != id); 
  
  this.guardarAlarmas(alarmas); // llamo a guardarAlarmas con el array modificado.
  }

eliminarTodasAlarmas() {
  // guardo un array vacío en localStorage, borrando todo lo que tiene, la logica es que reemplazo el contenido del localStorage con un array vacio
  localStorage.setItem('alarmas', JSON.stringify([]));
  // También reseteo el array interno del servicio
  this.alarmas = [];
}

}
