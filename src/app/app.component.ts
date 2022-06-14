import { Component, OnInit } from '@angular/core';

import { Platform,NavController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages:any;

  userData:any;
  setting:any;
  lang_data:any;
  dir = 'ltr';
  text:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private nav: NavController
  ) {

    if(localStorage.getItem('setting') && localStorage.getItem('setting') != undefined)
    {
      this.setting = JSON.parse(localStorage.getItem('setting'));
    }

    this.initializeApp();

    /*if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != 'null')
    {
      if(localStorage.getItem('current_lat') && localStorage.getItem('current_lat') != 'null')
      {
        this.nav.navigateRoot('/home');
      }
      else
      {
        this.nav.navigateRoot('/city');
      }
    }
    else
    {
      this.nav.navigateRoot('/welcome');
    }*/

    /*
    ********************************************
    **Setup language
    ********************************************
    */
    if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != undefined)
    {
      this.lang_data = JSON.parse(localStorage.getItem('lang_data'));

      this.dir       = this.lang_data.type == '1' ? 'rtl' : 'ltr';

      console.log(this.lang_data);
    }

    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
        this.text = JSON.parse(localStorage.getItem('app_text'));

         this.appPages = [
        {
          title: this.text.menu_home,
          url: '/home',
          icon: 'home'
        },
       
        {
          title: this.text.running_order,
          url: '/done',
          icon: 'stats-chart'
        },

        {
          title: this.text.account_title,
          url: '/account',
          icon: 'person'
        },

        {
          title: this.text.menu_lang,
          url: '/lang',
          icon: 'flag'
        },

        {
          title: this.text.menu_location,
          url: '/city',
          icon: 'location'
        },

        {
          title: this.text.menu_about,
          url: '/about',
          icon: 'information-circle'
        },
        
        {
          title: this.text.menu_faq,
          url: '/faq',
          icon: 'create'
        },
  
        {
          title: this.text.menu_contact,
          url: '/contact',
          icon: 'mail'
        },
        
      ];
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f47720');
      //this.statusBar.styleDefault();
      this.statusBar.styleLightContent();

      if(this.setting)
      {
       this.sub();
      }

    });
  }

  ngOnInit() {
    
    if(localStorage.getItem('user_data') && localStorage.getItem('user_data') != undefined && localStorage.getItem('user_data') != 'null')
    {
      this.userData = JSON.parse(localStorage.getItem('user_data'));
    }

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  
  sub()
  {
    this.oneSignal.startInit(this.setting.push_app_id, this.setting.push_google);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
     // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });


    if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != undefined)
    {
          this.oneSignal.sendTags({user_id: localStorage.getItem('user_id')});
    }

    this.oneSignal.endInit();
  }
}
