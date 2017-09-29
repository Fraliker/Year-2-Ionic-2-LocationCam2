import { Component } from '@angular/core';
import { NavParams,ViewController } from 'ionic-angular';
import { LibraryItem } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';
/*
  Generated class for the Picture page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html'
  /*template:`
        <ion-content padding>
            <button (click)="close()">Close</button>
        </ion-content>
    `*/
})
export class PicturePage {

  public picture:LibraryItem=null;

  constructor(public navParams: NavParams,private view:ViewController,private socialSharing: SocialSharing) {
    //Get the picture
    this.picture=this.navParams.get('picture');
  }

  //Function used to close this modal
  public close():void{
        this.view.dismiss();
  }
  //Function used to share this picture
  public share():void{
    //Share with social media plugin

    this.socialSharing.share("Taken with LocationCam 2", null, "file://"+this.picture.id.split(";")[1], null);
  }

}
