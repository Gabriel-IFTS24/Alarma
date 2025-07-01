import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  // Es casi lo mismo que la última parte de la clase 27.
  // https://ionicframework.com/docs/native/local-notifications

  async pedirPermisoNotificaciones(){
    const permiso = await LocalNotifications.requestPermissions();
    if(permiso.display !== 'granted'){
      alert('No se otorgó permiso para las notificaciones')
      return false
    }
    return true
  }

  async guardarNotificacion(id: number, titulo: string, cuerpo: string, timer: Date){
    // Aparentemente no hay forma de modificar la notificación; entonces si existe el Id la cancelo.
    await this.cancelarNotificacion(id);

    // Genero una nueva notificación.
    await LocalNotifications.schedule({
      notifications: [{
        title: titulo,
        body: cuerpo,
        //id: parseInt(Date.now().toString().slice(-6), 10),
        id: id, 
        schedule: {at: timer},
        actionTypeId:'',
        extra: null,
        sound: 'res://ding'
      }]
    })
  }

  async cancelarNotificacion(id: number){
    await LocalNotifications.cancel({
      notifications: [{ id }]
      });
  }
}

