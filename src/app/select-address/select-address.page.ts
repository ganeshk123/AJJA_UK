import { Component,ViewChild } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-select-address',
  templateUrl: 'select-address.page.html',
  styleUrls: ['select-address.page.scss'],
})
export class SelectAddressPage {

data:any;
text:any;
address:any;
address_id:any;

constructor(public navParams: NavParams,public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text       = JSON.parse(localStorage.getItem('app_text'));
this.address    = navParams.get('address');

}

  ngOnInit()
  {
    
  }


  async applyNow(a)
  {
    await this.modalController.dismiss({ address : a });
  }

  async closeModal() {
    
    await this.modalController.dismiss({id:false});
  }

  addAddress()
  {
    this.closeModal();
  }

}
