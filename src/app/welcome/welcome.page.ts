import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
})
export class WelcomePage {

data:any
subscription:any;

  constructor(public platform : Platform,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

  }

  ngOnInit()
  {
    
  }

  ionViewWillEnter()
  {
    this.loadData();
  }

  ionViewDidEnter()
  {

    this.subscription = this.platform.backButton.subscribe(()=>{
          
        this.presentAlertConfirm();

      });
  }

  ionViewWillLeave(){
      
      this.subscription.unsubscribe();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Exit App",
      message: "Are you sure?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: "Yes Exit!",
          handler: () => {
          
            navigator['app'].exitApp();

          }
        }
      ]
    });

    await alert.present();
}

async loadData()
{
  const loading = await this.loadingController.create({
    message: '',
    spinner:'bubbles'
    });
    await loading.present();

    this.server.welcome().subscribe((response:any) => {

    this.data = response.data;
        
    loading.dismiss();

    });
  }


  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:'dark'
    });
    toast.present();
  }
}
