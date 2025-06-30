import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonInput, IonList, IonDatetime, IonPicker, IonPickerColumn, IonPickerColumnOption} from '@ionic/angular/standalone';
import { AlarmaService } from '../services/alarma.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { Alarma } from '../models/alarma';
import { ToastController } from '@ionic/angular';

// import { IonFooter } from '@ionic/angular';
import { IonicModule} from "@ionic/angular"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  // imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonInput, IonList, IonDatetime, IonPicker, IonPickerColumn, IonPickerColumnOption, IonFooter],
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
  
})
export class HomePage {
  
  // Conceptualmente es muy parecido a la app de tareas de la clase 20, mezclado con lo que hicimos para Front/Magalí.
  
  constructor(private alarmaService: AlarmaService,
    private notificacionesService: NotificacionesService,
    private toastController: ToastController
  ) {
    this.alarmas = this.alarmaService.obtenerAlarmas(); 
  }

  alarmas: Alarma[]
  nuevaDescripcion = ''; 
  nuevoTimer = new Date();
  nuevaAlarmaMinutos = ''; // Opcion 2
  nuevaAlarmaSegundos = ''; // Opcion 2
  
  async agregarAlarma(){
    // let nuevoTimer = new Date() // Opcion 2

    // nuevoTimer.setMinutes(nuevoTimer.getMinutes() + Number(this.nuevaAlarmaMinutos)); // Opcion 2
    // nuevoTimer.setSeconds(nuevoTimer.getSeconds() + Number(this.nuevaAlarmaSegundos)); // Opcion 2

    // Instancio Alarma con los valores de la vista para pasarle al método guardarAlarma
    
    const nuevaAlarma: Alarma = { 
      id: Number(0),
      descripcion: this.nuevaDescripcion,
      timer: new Date(this.nuevoTimer)
    }
    
    this.alarmaService.guardarAlarma(nuevaAlarma); // Llamo al método para guardar alarmas con la nueva alarma.

    if (await this.notificacionesService.pedirPermisoNotificaciones()){
      this.notificacionesService.mostrarNotificacion('Alarma', this.nuevaDescripcion, new Date(this.nuevoTimer))
    }

    this.nuevaDescripcion=''; // Blanqueo el campo nuevaAlarma.
    
    this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.

  }

  eliminarAlarma(id: number){
    if (confirm(`¿Está seguro que desea eliminar la alarma ${id}?`)) {
      this.alarmaService.eliminarAlarma(id);
      this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.
      }
    }

    
  async testToast(){
    const toast = await this.toastController.create({
      message: 'Prueba!',
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
    
    async borrarTodasLasAlarmas() {
    const confirmacion = confirm('¿Esta seguro de que deseas borrar TODAS las alarmas?'); //estoy usando el async porque el perm de notificaciones tmb es async

    if (confirmacion) {
      // llamo al metodo para eliminar
      this.alarmaService.eliminarTodasAlarmas();
      // cargo las alarmas
      this.alarmas = this.alarmaService.obtenerAlarmas();
      }
    }
}
