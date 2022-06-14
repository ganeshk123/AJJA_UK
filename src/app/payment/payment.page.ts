import { Component,ViewChild } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss'],
})
export class PaymentPage {

@ViewChild('content',{static : false}) private content: any;


data:any;
text:any;
setting:any;
total:any;
payment:any;
stripeView = false;
card_no:any;
exp_month:any;
exp_year:any;
cvv:any;
years:any;
wallet:any;
user:any;
hasEcash:any;

constructor(public navParams: NavParams,public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text    = JSON.parse(localStorage.getItem('app_text'));
this.setting = JSON.parse(localStorage.getItem('setting'));
this.years   = JSON.parse(localStorage.getItem('years'));
this.total   = navParams.get('total');
this.wallet  = navParams.get('wallet');
this.user    = navParams.get('user');

console.log(this.total);

}

  ngOnInit()
  {
    
  }

async loadData()
{
  const loading = await this.loadingController.create({
    spinner:'bubbles'
    });
    await loading.present();

    this.server.getOffer(localStorage.getItem('cart_no')).subscribe((response:any) => {

    this.data = response.data;

    loading.dismiss();

    });
  }

  async applyNow()
  {
    await this.modalController.dismiss({ hasEcash : this.hasEcash,payment : this.payment,card_no : this.card_no,exp_month : this.exp_month, exp_year : this.exp_year,cvv : this.cvv });
  }

  async closeModal() {
    
    await this.modalController.dismiss({id:false});
  }

  setPayment(id)
  {
     this.payment = id;

    /*if(id == 2)
    {
      this.stripeView = true;

      setTimeout(() => {
      this.content.scrollToBottom(300);
      }, 100);
    }
    else
    {
      this.stripeView = false;
    }*/
  }

  allSet()
  {
    if(this.payment)
    {
      return true;
    }
    else
    {
      if(this.hasEcash)
      {
        if(this.total - this.wallet <= 0)
        {
          return true;
        }
      }
      else
      {
        return false;
      }
    }
  }

  useEcash()
  {
    this.hasEcash = this.hasEcash == true ? false : true;
  }
}
