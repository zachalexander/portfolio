import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  pusher: any

  constructor(private http: HttpClient) { 
    this.pusher = new Pusher(environment.PUSHER_API_KEY, {
      cluster: environment.PUSHER_API_CLUSTER,
      forceTLS: true
    });
  }

  subScribeToChannel(channelName: String, events: String[], cb: Function) {
    var channel = this.pusher.subscribe(channelName);

    events.forEach( event => {
      channel.bind(event, function(data) {
        cb(data)
      });
    })
  }

  triggerEvent(channelName: String, event: String, data: Object): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/pusher/trigger`, {
      channel_name: channelName,
      event_name: event,
      data: data
    })
  }
}
