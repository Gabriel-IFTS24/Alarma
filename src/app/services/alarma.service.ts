import { Injectable } from '@angular/core';
import { Alarma } from '../models/alarma';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {

  constructor(private notificacionesService: NotificacionesService) {
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

  guardarAlarma(alarma: Alarma): number {
    let alarmas = this.obtenerAlarmas(); // Obtengo las alarmas.

    // Si tengo un id, y existe el id en alarmas.
    if(alarma.id != null && alarma.id !=0 && alarmas.some(a => a.id == alarma.id)){
      // Reemplazo la alarma existente por la nueva.
      alarmas = alarmas.map(a => a.id == alarma.id ? alarma : a)
    }
    // Sino, grabo la alarma con un nuevo id.
    else {
      alarma.id = this.nuevoId++;
      alarmas.push(alarma)
    }
    this.guardarAlarmas(alarmas) // Guardo todas las alarmas.
    return alarma.id; // Retorno el id para las notificaciones.
  }

  guardarAlarmas(alarmas: Alarma[]){
    localStorage.setItem('alarmas', JSON.stringify(alarmas))
  }

  eliminarAlarma(id:number){
    let alarmas = this.obtenerAlarmas(); // Obtengo las alarmas.

    alarmas = alarmas.filter((alarma)=> alarma.id != id); 
    
    this.guardarAlarmas(alarmas); // llamo a guardarAlarmas con el array modificado.
    }

  async eliminarTodasAlarmas() {
    
    for (let alarma of this.alarmas) {
      if (alarma.id !== undefined) {
        await this.notificacionesService.cancelarNotificacion(alarma.id);
      }
    }
    
    // guardo un array vacío en localStorage, borrando todo lo que tiene, la logica es que reemplazo el contenido del localStorage con un array vacio
    localStorage.setItem('alarmas', JSON.stringify([]));
    // También reseteo el array interno del servicio
    this.alarmas = [];
  }
}
