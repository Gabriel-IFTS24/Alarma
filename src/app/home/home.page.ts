import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonInput, IonList, IonDatetime, IonPicker, IonPickerColumn, IonPickerColumnOption} from '@ionic/angular/standalone';
import { AlarmaService } from '../services/alarma.service';
import { Alarma } from '../models/alarma';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonInput, IonList, IonDatetime, IonPicker, IonPickerColumn, IonPickerColumnOption],
})
export class HomePage {
  
  // Conceptualmente es muy parecido a la app de tareas de la clase 20, mezclado con lo que hicimos para Front/Magalí.
  
  constructor(private alarmaService: AlarmaService) {
    this.alarmas = this.alarmaService.obtenerAlarmas(); 
  }

  alarmas: Alarma[]
  nuevaDescripcion = ''; 
  nuevaAlarmaMinutos = '';
  nuevaAlarmaSegundos = '';
  
  agregarAlarma(){
    let nuevoTimer = new Date()

    nuevoTimer.setMinutes(nuevoTimer.getMinutes() + Number(this.nuevaAlarmaMinutos));
    nuevoTimer.setSeconds(nuevoTimer.getSeconds() + Number(this.nuevaAlarmaSegundos));

    const nuevaAlarma: Alarma = { 
      id: 0,
      descripcion: this.nuevaDescripcion,
      timer: nuevoTimer
    }

    this.alarmaService.guardarAlarma(nuevaAlarma); // Llamo al método para guardar alarmas con la nueva alarma.

    this.nuevaDescripcion=''; // Blanqueo el campo nuevaAlarma.

    this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.
  }

  eliminarAlarma(id: number){
    if (confirm(`¿Está seguro que desea eliminar la alarma ${id}?`)) {
      this.alarmaService.eliminarAlarma(id);
      this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.
      }
    }
}
