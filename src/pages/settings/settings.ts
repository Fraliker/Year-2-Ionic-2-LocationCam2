import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Settings } from '../../providers/settings';



@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  //The settings object
  public settings;

  constructor(public navCtrl: NavController, public settingsProv: Settings) {
     //Subscribe for setting changes
     this.settingsProv.setting.subscribe((data)=>{
        //Reset the local settings variable every time a setting is changed
        //Could change the BehaviorSubject to send back the key of the setting which changed. So not the whole settings object would be updated
        this.settings=this.settingsProv.getSettings();
        //console.log(this.settings.saveToGallery);
     });
     // console.log(this.settings);
  }
}
