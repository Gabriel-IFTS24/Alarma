import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule} from "@ionic/angular"
import { AlarmaService } from '../services/alarma.service';
import { Alarma } from '../models/alarma';
import { NotificacionesService } from '../services/notificaciones.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
  
})
export class HomePage {

  constructor(private alarmaService: AlarmaService,
    private notificacionesService: NotificacionesService,
    private toastController: ToastController
  ) {
    this.alarmas = this.alarmaService.obtenerAlarmas(); 
  }

  alarmas: Alarma[]
  nuevaDescripcion = ''; 
  nuevoTimer = new Date();
  alarmaEditada: Alarma | null = null; //Se utiliza para almacenar la alarma que se esta editando.
  idNotificacion = 0; // Se utiliza para el id único de la notificación
  
  async agregarAlarma(){
    // Si estoy editando una alarma existente (alarmaEditada no es null)
    if(this.alarmaEditada){
      // Actualizo la descripcion y el timer con los nuevos valores
      this.alarmaEditada.descripcion = this.nuevaDescripcion;
      this.alarmaEditada.timer = new Date(this.nuevoTimer);

      // Guardo la alarma con los cambios
      this.idNotificacion = this.alarmaService.guardarAlarma(this.alarmaEditada);

      // Al terminar la modificacion la vuelvo a null
      this.alarmaEditada = null;
    } else {
      // Instancio Alarma con los valores de la vista para pasarle al método guardarAlarma
      const nuevaAlarma: Alarma = { 
        id: Number(0),
        descripcion: this.nuevaDescripcion,
        timer: new Date(this.nuevoTimer)
      }

      this.idNotificacion = this.alarmaService.guardarAlarma(nuevaAlarma); // Llamo al método para guardar alarmas con la nueva alarma.
    }
    
    // Envio de la notificación. Primero pido los permisos y la schedulo.
    if (await this.notificacionesService.pedirPermisoNotificaciones()){
      this.notificacionesService.guardarNotificacion(this.idNotificacion, 'Alarma', this.nuevaDescripcion, new Date(this.nuevoTimer))
    }
    
    this.nuevaDescripcion=''; // Blanqueo el campo nuevaAlarma.
    
    this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.
    
  }

  editarAlarma(alarma: Alarma){
    this.alarmaEditada = { ...alarma }; // creo una copia del objeto alarma para no modificar el original
    this.nuevaDescripcion = alarma.descripcion || '';
    this.nuevoTimer = alarma.timer ? new Date(alarma.timer) : new Date();
    console.log(`Editando alarma con ID: ${alarma.id}`);
  }

  cancelarEdicion() {
    this.alarmaEditada = null;
    this.nuevaDescripcion = '';
    this.nuevoTimer = new Date();
  }

  eliminarAlarma(id: number){
    if (confirm(`¿Está seguro que desea eliminar la alarma ${id}?`)) {
      this.alarmaService.eliminarAlarma(id);
      this.alarmas = this.alarmaService.obtenerAlarmas(); // Actualizo la lista de alarmas.
    }
  }

  async borrarTodasLasAlarmas() {
    const confirmacion = confirm('¿Esta seguro de que deseas borrar TODAS las alarmas?'); 

    if (confirmacion) {
      // Llamo al método para eliminar y espero que termine para actualizar.
      await this.alarmaService.eliminarTodasAlarmas();
      // Cargo las alarmas después de la eliminación.
      this.alarmas = this.alarmaService.obtenerAlarmas();
    }
  }
}
