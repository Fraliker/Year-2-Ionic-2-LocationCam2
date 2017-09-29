import { Directive,Input} from '@angular/core';
import { Settings } from '../../providers/settings';


@Directive({
  selector: '[settingsclick]',
  host:{'(ngModelChange)' : 'onInputChange($event)'}
})
export class SettingsClickDirective{
  //Get the input value
  @Input() settingsclick:string;
  //Inject settings
  constructor(private settings:Settings){}
  
  /*ngOnInit(){
    console.log("value: "+this.settingsclick);
  }*/
  
  //Capture on change
  onInputChange(value){
    //Set the new walue to the settings
    //This will fire the next on the settings observable
    this.settings.set(this.settingsclick,value);
  }

}