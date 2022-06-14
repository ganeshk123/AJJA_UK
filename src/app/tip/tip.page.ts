import { Component,ViewChild } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-tip',
  templateUrl: 'tip.page.html',
  styleUrls: ['tip.page.scss'],
})
export class TipPage {

tips:any;
text:any;
setting:any;

constructor(public navParams: NavParams,public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text    = JSON.parse(localStorage.getItem('app_text'));
this.setting = JSON.parse(localStorage.getItem('setting'));
this.tips    = navParams.get('tips');

}

  ngOnInit()
  {
    
  }

  async applyNow(t)
  {
    await this.modalController.dismiss({ tip : t });
  }

  async closeModal() {
    
    await this.modalController.dismiss({id:false});
  }
}
