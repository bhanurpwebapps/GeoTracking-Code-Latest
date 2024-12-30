import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Connect to the backend socket server
    this.socket = io('http://192.168.1.59:5000'); // Replace with your backend URL
    // this.socket = io('http://13.112.249.61');
  }

  // Listen for gateway status updates
  onGatewayStatus(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('gatewayStatus', (data) => {
        console.log(data);
        subscriber.next(data);
      });

      // Cleanup on unsubscribe
      return () => {
        console.log("off");
        this.socket.off('gatewayStatus');
      };
    });
  }


  // Listen for Attendance status updates
  onStudentTrackingStatus(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('deviceLocation', (data) => {
        console.log(data);
        subscriber.next(data);
      });

      // Cleanup on unsubscribe
      return () => {
        console.log("off");
        this.socket.off('deviceLocation');
      };
    });
  }
}
