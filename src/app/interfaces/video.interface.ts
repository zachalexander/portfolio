export default class VideoInterface {

    id: number;
    tweetId: string;
    username: string;
    linkSafe: any;
    twitterurl: any;
  
    constructor(id: number, tweetId: string, username: string, linkSafe: any, twitterurl: any) {
  
      this.id = id;
      this.tweetId = tweetId;
      this.username = username;
      this.linkSafe = linkSafe;
      this.twitterurl = twitterurl;
    }
  }