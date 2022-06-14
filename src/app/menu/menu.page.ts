import { Component, OnInit } from '@angular/core';
import { ModalController,NavController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

text:any;
user:any;

  constructor(public navParams: NavParams,public modalController: ModalController,private nav: NavController) {

   this.text    = JSON.parse(localStorage.getItem('app_text'));
   this.user    = navParams.get('user');

  }

  ngOnInit() {
  }

  close() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  logout()
  {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_data");
    
    this.modalController.dismiss({
      'logout': true
    });
  }

  gotoPage()
  {
      this.nav.navigateForward('/account'); 

      this.modalController.dismiss({
      'dismissed': true,
      'animation' : true
    });
  }

}
