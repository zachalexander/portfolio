import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class MediumService {

  constructor(private http: Http) { }

  // searchPubs(): Observable<XMLDocument> {
  //   const headers = new Headers();
  //   headers.set('Authorization', 'Bearer 294520ce84c9c56dbe530bc32dcddd480bf0122f8708260bc8d42909e9c29c5dc');
  //   return this.http.get('https://medium.com/feed/@zdalexander', {headers: headers})
  //     .map(resp => resp);
  // }


}
