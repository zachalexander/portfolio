import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class SocketService {
    private socket;

    constructor() {
    }

    getTweets(): Observable<any> {
      return Observable.create((observer) => {
          this.socket.on('time', (time) => {
              observer.next(time);
          });
      });
  }
}
