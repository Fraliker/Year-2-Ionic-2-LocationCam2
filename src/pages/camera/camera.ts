import { Component } from '@angular/core';
import { Camera,Geolocation  } from 'ionic-native';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { NavController, Nav } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { Http } from '@angular/http';

@Component({
  selector: 'page-camera',
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers:[Geolocation]
})
export class CameraPage {

   //The settings object
  private settings;
  //Device location
  private location="Ireland";
  
  
  constructor(public navCtrl: NavController, private nav: Nav, private settingsProvider: Settings,private http:Http, private photoL:PhotoLibrary) {
    //Subscribe for setting changes
        this.settingsProvider.setting.subscribe((data)=>{
            //Reset the local settings variable every time a setting is changed
            this.settings=this.settingsProvider.getSettings();
            //console.log(this.settings);
        }); 

    //Get the location for the first time
    this.getLocation();

  }

  //Method used to take a picture
  private takePicture():void{
    //alert(this.settings.camEditable+" "+this.settings.saveToGallery);  
    //Set the options for the camera
    Camera.getPicture({
            //Quality
            quality: this.settings.camQuality,
            //Create base64
            destinationType: Camera.DestinationType.DATA_URL,
            //Use the camera not the gallery as source
            sourceType: Camera.PictureSourceType.CAMERA,
            //Do not edit
            allowEdit: this.settings.camEditable,
            //Save in JPEG
            encodingType: Camera.EncodingType.JPEG,
            //Fix the orientation of the picture
            correctOrientation:true,
            //Do not save into the photo album
            saveToPhotoAlbum: this.settings.saveToGallery    
    }).then((imageData:string) => {
          //Modify the picture
          this.addWatermark(imageData);
    }, (err:string) => {
      //Handle error
       //Check if the user cancelled the camera
      if(err!='Camera cancelled.'){
            //show the fail message
            alert('Failed because: ' + err);
      }
      this.navCtrl.parent.select(0);
    });
    
  }

 //Function used to add watermark
  private addWatermark(imageData:string):void{
        //Create the image from the base64 data
        let img = new Image();
        img.src="data:image/jpeg;base64,"+imageData;
        //Create a new canvas
        let canvas=document.createElement('canvas');
        //Get the context of the canvas
        let ctx=canvas.getContext("2d");
        
        //Go around encapsulation
        let settings=this.settings;
        let navCtrl=this.navCtrl;
        let location=this.location;
        let parent=this;
        //When the picture is loaded we begin the operations with it
        img.onload = function(){

            //Set the canvas size to the equivalent of the picture
            canvas.width=img.width;
            canvas.height=img.height;
            //Draw the image onto the canvas
            ctx.drawImage(img,0,0);
            
            let textToWrite:string='';
            //Check if the gelocation is needed
            if(settings.enableLocation){
                //Add location
                textToWrite+=location;
            }
            //Check if the Date is needed
            if(settings.enableDate){
                //Check if there is already something
                if(textToWrite!=''){
                    //Add a spacer
                    textToWrite+=" - ";
                }
                //Get the date 
                let date:Date = new Date();
                //Get the day
                let day:number = date.getDate();
                //Get the month
                let month:number = date.getMonth()+1; 
                //Get the year
                let year:number = date.getFullYear();
                //Add leading zeros to day
                if(day<10) textToWrite+='0';
                //Add day
                textToWrite+=day+'/';
                //Add leading zeros to month
                if(month<10) textToWrite+='0';
                
                //Add month and year
                textToWrite+=month+'/'+year;

            }
             //If there is something to write onto the picture
            if(textToWrite!=''){

                //Set base position         
                let horizontal:number=10;
                let vertical:number=30;
                let textAlign:string='left';  
                let textBaseline:string='top';  
                
                //Get font style
                let style:string=settings.fontStyle.toLowerCase();
                let letiant:string=settings.fontVariant.toLowerCase();
                let weight:string=settings.fontWeight.toLowerCase();
                let size:string=settings.fontSize+'px';
                let family:string=settings.fontFamily;
                //Set font style
                ctx.font=style+" "+letiant+" "+weight+" "+size+' '+family;  

                //Background box position
                let boxVertical:number=30;
                
                //Decide horizontal position
                switch(settings.textPositionHorizontal){
                    case 'Left':
                        break;
                    case 'Center':
                        textAlign='center';
                        horizontal=canvas.width/2;
                        break;
                    case 'Right':
                        textAlign='right';
                        horizontal=canvas.width-10;
                        break;
                } 

                //Decide vertical position
                switch(settings.textPositionVertical){
                    case 'Top':
                        break;
                    case 'Middle':
                        textBaseline='middle';
                        vertical=canvas.height/2;
                        boxVertical=vertical -(parseInt(settings.fontSize)/2);
                        break;
                    case 'Bottom':
                        textBaseline='bottom';
                        vertical=canvas.height-10;
                        boxVertical=vertical-parseInt(settings.fontSize)-7.5;
                        break;
                }

                //Set text vertical align
                ctx.textBaseline=textBaseline;
                //Set text horizontal aligning
                ctx.textAlign=textAlign; 
                

                //Check the box should be shown
                if(settings.textBoxShow){
                    //Set the font color
                    ctx.fillStyle=settings.boxColor;
                    //Set the opacity of the box
                    ctx.globalAlpha=0.4;
                    //Create background box
                    ctx.fillRect(0,boxVertical,canvas.width,parseInt(settings.fontSize)+5);
                    //Set alpha back to full
                    ctx.globalAlpha=1;
                }

                //Set the font color
                ctx.fillStyle=settings.fontColor;             

                //Write onto the image 
                ctx.fillText(textToWrite,horizontal,vertical);


            }
            
            
            //Save the picture to the album
            parent.photoL.saveImage(canvas.toDataURL("image/jpeg"),"LocationCam").then((libraryItem)=>{
              //Go back to the first tab
              navCtrl.parent.select(0);
            })
            .catch(err=>{
                if(JSON.stringify(err)!="{}")
                    alert(JSON.stringify(err));
                
                navCtrl.parent.select(0);
            });
        }
    } 

 //Function used to get the location
 private getLocation():void{
        Geolocation.getCurrentPosition({
            //Set the settings before getting the location
            timeout: 10000,
            enableHighAccuracy: false})
        .then(position=>{
            //Create the url for googles location api
                                     let url:string  = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en';
                                     //Call the url
                                     this.http.get(url).subscribe((resp)=>{
                                           //Convert the response to json
                                           let data=resp.json();
                                           //Basic variable for the location 
                                           let location:string ='';
                                           //If there is a location retrieved
                                           if(data.results != null){
                                               //Loop through the result. Skip the first two index as i dont need full address
                                               for(let i:number =2; i<10; i++){
                                                    //Check if the next line is available
                                                    if(data.results[0].address_components[i]!=null){
                                                        //Set the line to the temporary variable
                                                        let value:string=data.results[0].address_components[i].long_name;
                                                        //Duplicate prevention
                                                        let has:boolean=false;
                                                        //Break the line.
                                                        for(let v of value.split(" ")){
                                                            //if any part of the line is in the location already then dont add this line
                                                            if(location.indexOf(v)!=-1) has=true;
                                                        }
                                                        //If the line is not added yet
                                                        if(location.indexOf(value)==-1 && !has){
                                                            //Add the line
                                                            location+=value;
                                                            //Add a comma and a space if the line is not the last line
                                                            if(i<6 && data.results[0].address_components[i+1]!=null) location+=", ";
                                                        }   
                                                    }else{
                                                        //Exit the loop as there is no more lines
                                                        break;
                                                    }
                                               }
                                           }
                                           //Set the location variable in the scope
                                           this.location=location;
                                           //Set the message to be empty.
                                           //this.message="";
                                     });
        }).catch(err=>{
            if(JSON.stringify(err)!="{}")
                alert(JSON.stringify(err));
        });
 }

 //This loads on view onload
  ionViewWillEnter() {
    //Get the location
    this.getLocation();
    //Load the gallery
    this.takePicture();  
  }

}
