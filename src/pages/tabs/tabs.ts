import { Component } from '@angular/core';

import { CameraPage } from '../camera/camera';
import { AlbumsPage } from '../albums/albums';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  
  tab1Root: any = AlbumsPage;
  tab2Root: any = CameraPage;
  tab3Root: any = SettingsPage;

  constructor() {

  }
}
