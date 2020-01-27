import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  private endpoint = 'http://localhost:8000/users/';

  constructor(private http: HttpClient) { }

  // Get all Users

  getAllUsers(): Observable<any> {
    return this.http.get(this.endpoint);
  }
}
