import { Component,ChangeDetectorRef } from '@angular/core';
import { Platform,ModalController} from 'ionic-angular';
import { PhotoLibrary, LibraryItem } from '@ionic-native/photo-library';
import { PicturePage } from '../picture/picture';

@Component({
  selector: 'page-albums',
  templateUrl: 'albums.html'
})
export class AlbumsPage {
  //The library holder
  public library: LibraryItem[];
  //Whether the library is loading or not
  public libraryLoading: boolean;

  constructor(private platform: Platform, private cd: ChangeDetectorRef, private modalCtrl: ModalController, private photoL:PhotoLibrary) {
      //Initiallize library loading
      this.libraryLoading=true;
  }

   //Get photos from the device
  private fetchPhotos():void {
    //Run when the platform is ready
    this.platform.ready().then(() => {
      this.libraryLoading=true;
      //Get the photos
      this.photoL.getLibrary({thumbnailWidth: 512, thumbnailHeight: 384, chunkTimeSec: 0.1}).subscribe({
        //When it is ready
        next: (chunk) => {
          //Reset the library
          this.library = [];
          //Filter the albums
          //Go through the items
          chunk.forEach((libraryItem)=>{
                 //If it belongs to location cam
                 if(libraryItem.id.indexOf('LocationCam')!=-1){
                      //Add it to the images
                      this.library.push(libraryItem);
                 }
        });
          //The library loading is finshed
          this.libraryLoading=false;
          //Detect directory changes
          this.cd.detectChanges();
        },
        //If there was an error
        error: (err: string) => {
          //Check if it is permission error
          if (err.startsWith('Permission')) {
            //Request the authorization from the user
            this.photoL.requestAuthorization({read: true})
              //Try to get the pictures again
              .then(() => {this.fetchPhotos(); })
              //Error handling
              .catch((err) => {});
          }
          //The library loading is finshed
          this.libraryLoading=false;
        }
      });

    });

  }

  //Function used to open the picture modal
  public openPicture(picture:LibraryItem):void{
     this.modalCtrl.create(PicturePage,{picture: picture}).present();
  }

  //This loads on view onload
 ionViewWillEnter() {
    //Load the gallery
    this.fetchPhotos();  
  }

}
