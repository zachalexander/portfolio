import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  private endpoint = 'http://localhost:8000/users/';
  private tweetendpoint = 'http://localhost:8000/tweets-latest/';
  private tweetsall = 'https://guarded-anchorage-28885.herokuapp.com/tweets-all/';
  private tweetcount = 'http://localhost:8000/tweet-count/';
  private randomcount = 'http://localhost:8000/random/';

  private coronavirusapi = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs';

  constructor(private http: HttpClient) { }

  // Get all Users

  getAllUsers(): Observable<any> {
    return this.http.get(this.endpoint);
  }

    // Get all Users

  getAllTweets(): Observable<any> {
    return this.http.get(this.tweetsall);
  }

  getFirstTweet(): Observable<any> {
    return this.http.get(this.tweetendpoint);
  }

      // Get all Users

  getTweetCount(): Observable<any> {
    return this.http.get(this.tweetcount);
  }

  getVirusCounts(): Observable<any> {
    return this.http.get(this.coronavirusapi);
  }

    // Get all Users

  getAllRandos(): Observable<any> {
    return this.http.get(this.randomcount);
  }
}
