import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class Settings {

  private settings={camQuality:100,
                    camEditable:true,
                    saveToGallery:true,
                    textPositionVertical:'Top',
                    textPositionHorizontal:'Left',
                    fontStyle:'Normal',
                    fontVariant:'Normal',
                    fontWeight:'Normal',
                    fontSize:36,
                    fontColor:'#ffffff',         
                    fontFamily:'Arial,"Helvetica Neue",Helvetica,sans-serif',
                    textBoxShow:true,  
                    boxColor:'#ffffff',  
                    enableLocation:true,  
                    enableDate:true,                              
                  };
            

  public setting: any;

 private storage:Storage; 

  constructor(/*private storage: Storage*/) {
    this.storage =new Storage();
   console.log("Constructed"); 

   this.setting=new BehaviorSubject(false); 

    //Wait until the storage is ready
    this.storage.ready().then(()=>{
        
        //Initialize the settings
        this.initSettings();
        //Load the settings from storage  
        this.getSettingsFromStorage();
    });
  }

  //Initiate the settings
  private initSettings():void{
    
      //Get the INITIALIZED from storage
      this.storage.get('INITIALIZED').then((val)=>{
          //If it is not true then it is not initialized yet
          if(val==null || val==false){
            //Set initialized to true
            this.storage.set('INITIALIZED',true);
            //Loop the settings
            for(let key in this.settings){
              //Skip changeSettings as it is a function
              //if(key=='changeSetting') continue;
              //Set the key
              this.storage.set(key,this.settings[key]);
            } 
          }
      });
    
  }


  private getSettingsFromStorage(){
    //Map the keys of the settings object
    Object.keys(this.settings).map((key)=>{
       //Get the value of the key from the storage
        this.storage.get(key).then((val)=>{
            //Set the value
            this.settings[key]=val;
            //eval('this.settings.'+key+'='+val);
            //Notify the observable
            this.setting.next(true);

        });  
    });
  }

 //Set a value
 public set(key,val:String):void{
       //Set in the memory storage as well
       this.settings[key]=val; 
       //Delegate the set method 
       this.storage.set(key,val);
       //Notify the observable
       this.setting.next(true);
  }

  //Return the settings Object
  public getSettings(){
    return this.settings;
  }

  //Return the value of a key
  public get(key):String{
    this.storage.get(key).then((val)=>{
            //Set the value
            //console.log(val);
        }); 
    return this.settings[key];
  }


  //Return the value if loaded
  public whenReady(callback){
    this.storage.ready().then(()=>{
        callback();
    });
  }
}
