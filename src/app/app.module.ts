import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { AlbumsPage } from '../pages/albums/albums';
import { SettingsPage } from '../pages/settings/settings';
import { PicturePage } from '../pages/picture/picture';
import { CameraPage } from '../pages/camera/camera';
import { TabsPage } from '../pages/tabs/tabs';
import { SocialSharing } from '@ionic-native/social-sharing';


import { CDVPhotoLibraryPipe } from './cdvphotolibrary.pipe.ts';
import { Settings } from '../providers/settings';
import { SettingsClickDirective } from '../pages/settings/settingsclick.directive.ts';
import { PhotoLibrary } from '@ionic-native/photo-library';
@NgModule({
  declarations: [
    MyApp,
    AlbumsPage,
    SettingsPage,
    CameraPage,
    TabsPage,
    PicturePage,
    CDVPhotoLibraryPipe,
    SettingsClickDirective,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    //IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlbumsPage,
    SettingsPage,
    CameraPage,
    TabsPage,
    PicturePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Settings, SocialSharing,PhotoLibrary],
  exports:[SettingsClickDirective]

})
export class AppModule {}
