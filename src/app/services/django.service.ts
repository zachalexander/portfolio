import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import VideoInterface from '../interfaces/video.interface';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  private pageNr = 1;

  // private tweetendpoint = 'http://localhost:8000/tweets-latest/';
  // private tweetsall = 'https://guarded-anchorage-28885.herokuapp.com/tweets-all/';
  private tweetsall = `https://twitter-streaming-videos.herokuapp.com/tweets-all/?page=${this.pageNr}`;
  private tweetsfull = "https://twitter-streaming-videos.herokuapp.com/tweets-full/";
  // private tweetcount = 'http://localhost:8000/tweet-count/';

  private coronavirusapi = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs';

  constructor(private http: HttpClient) { }



    // Get all Users

  getAllTweets(): Observable<VideoInterface[]> {
    return this.http.get<VideoInterface[]>(this.tweetsall);
  }

  getFullTweets(): Observable<VideoInterface[]> {
    return this.http.get<VideoInterface[]>(this.tweetsfull);
  }

  // getFirstTweet(): Observable<any> {
  //   return this.http.get(this.tweetendpoint);
  // }

  // getTweetCount(): Observable<any> {
  //   return this.http.get(this.tweetcount);
  // }

  getVirusCounts(): Observable<any> {
    return this.http.get(this.coronavirusapi);
  }

  paginatePage(value): Observable<VideoInterface[]> {
    this.tweetsall = 'http://localhost:8000/tweets-all/?page=' + value;
    return this.http.get<VideoInterface[]>(this.tweetsall);
  }
}
