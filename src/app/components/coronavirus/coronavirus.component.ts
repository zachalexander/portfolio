import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/users';
import { Tweets } from '../../models/tweets';
import { TweetCount } from '../../models/tweetcount';
import { DjangoService } from '../../services/django.service';

@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.component.html',
  styleUrls: ['./coronavirus.component.sass']
})
export class CoronavirusComponent implements OnInit {

  tweets: Observable<Tweets[]>;
  tweetcount: Observable<TweetCount[]>;

  constructor(private djangoService: DjangoService) { }

  ngOnInit() {
    this.loadTwitterData();
  }

  loadTwitterData() {
    this.tweets = this.djangoService.getAllTweets();
    this.tweetcount = this.djangoService.getTweetCount();
  }

}
