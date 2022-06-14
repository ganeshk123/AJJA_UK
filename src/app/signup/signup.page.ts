import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  
  text:any;
  setting:any;
  hasTerm = false;
  country:any = 91;
  countrys:any;
  otp:any;
  codeSent:any;
  user_id:any;
  phone:any;

  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController){

  this.text    = JSON.parse(localStorage.getItem('app_text'));
  this.setting = JSON.parse(localStorage.getItem('setting'));
  this.countrys = JSON.parse(localStorage.getItem('country'));
  }

  ngOnInit()
  {
  
  }

  term()
  {
    this.hasTerm = this.hasTerm == true ? false : true;
  }

  async signup(data)
  {
    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles',
      duration:3000
    });
    await loading.present();

    this.server.signup(data).subscribe((response:any) => {
    
    console.log(response.otp);

    if(response.msg != "done")
    {
    	this.presentToast(this.text.signup_error);
    }
    else
    {
    	if(response.otp > 0)
      {
        this.otp     = response.otp;
        this.user_id = response.user.id;

        if(response.codeSent == 1)
        {
          this.codeSent = data.email;
        }
        else
        {
          this.codeSent = data.phone;
        }
      }
      else
      {
        localStorage.setItem('user_id',response.user.id);

        localStorage.setItem('user_data', JSON.stringify(response.user));
      
        if(localStorage.getItem('cart_no') && localStorage.getItem('cart_no') != undefined)
        {
          this.nav.navigateBack('/cart');
        }
        else
        {
          this.nav.navigateRoot('/account');
        }
      }
    }

    loading.dismiss();

    });
  }

  async verify(data)
  {
    if(data.vcode != this.otp)
    {
      return this.presentToast("Please enter valid OTP");
    }

    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles',
      duration:4000
    });
    await loading.present();

    this.server.verifyUser(this.user_id).subscribe((response:any) => {
  
    localStorage.setItem('user_id',response.user.id);

    localStorage.setItem('user_data', JSON.stringify(response.user));
  
    if(localStorage.getItem('cart_no') && localStorage.getItem('cart_no') != undefined)
    {
      this.nav.navigateBack('/cart');
    }
    else
    {
      this.nav.navigateRoot('/account');
    }

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
