import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  // Es casi lo mismo que la última parte de la clase 27.

  async pedirPermisoNotificaciones(){
    const permiso = await LocalNotifications.requestPermissions();
    if(permiso.display !== 'granted'){
      alert('No se otorgó permiso para las notificaciones')
      return false
    }
    return true
  }

  async mostrarNotificacion(titulo: string, cuerpo: string, timer: Date){
    await LocalNotifications.schedule({
      notifications: [{
        title: titulo,
        body: cuerpo,
        id: new Date().getTime(),
        schedule: {at: timer},
        actionTypeId:'',
        extra: null
      }]
    })
  }
}

