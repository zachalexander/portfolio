import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/users';
import { Tweets } from '../../models/tweets';
import { TweetCount } from '../../models/tweetcount';
import { DjangoService } from '../../services/django.service';
import { Observable} from 'rxjs';


@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.component.html',
  styleUrls: ['./coronavirus.component.scss']
})
export class CoronavirusComponent implements OnInit {

  tweets: Observable<Tweets[]>;
  tweetcount: Observable<TweetCount[]>;

  constructor(
    private djangoService: DjangoService
  ) { }

  ngOnInit() {
    this.loadTwitterData();
  }

  loadTwitterData() {
    this.tweets = this.djangoService.getAllTweets();
    this.tweetcount = this.djangoService.getTweetCount();
  }

}
