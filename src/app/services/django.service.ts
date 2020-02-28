import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';
import { Tweets } from '../models/tweets';
import { TweetCount } from '../models/tweetcount';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  private endpoint = 'http://localhost:8000/users/';
  private tweetendpoint = 'http://localhost:8000/tweets/';
  private tweetcount = 'http://localhost:8000/tweet_count/';

  constructor(private http: HttpClient) { }

  // Get all Users

  getAllUsers(): Observable<any> {
    return this.http.get(this.endpoint);
  }

    // Get all Users

  getAllTweets(): Observable<any> {
    return this.http.get(this.tweetendpoint);
  }

      // Get all Users

  getTweetCount(): Observable<any> {
    return this.http.get(this.tweetcount);
  }
}
