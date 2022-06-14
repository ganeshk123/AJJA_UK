import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController,ModalController,IonRouterOutlet,AlertController } from '@ionic/angular';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PaymentPage } from '../payment/payment.page';
import { SelectAddressPage } from '../select-address/select-address.page';
import { TipPage } from '../tip/tip.page';

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit {
  
@ViewChild('content',{static : false}) private content: any;

  data:any;
  a_date:any;
  a_time:any;
  time:any;
  name:any;
  phone:any;
  comment:any;
  landmark:any;

  /*Stripe Config & Payment*/
  stripeView = false;
  card_no:any;
  exp_month:any;
  exp_year:any;
  cvv:any;
  payment:any;
  payment_id:any;
  text:any;
  revisit = false;
  discount:any = 0;
  setting:any;
  r = false;
  otype:any = 1;
  odate:any = 1;
  todayDate:any;
  order_date:any;
  order_time:any;
  address:any = [];
  address_id:any;
  user:any;
  hasEcash = false;
  ecash:any = 0;
  wallet:any = 0;
  stripe_id:any;
  razor_id:any;
  cod = true;
  addressName:any;
  api:any;
  dates:any;
  times:any;
  tips:any;
  tip:any = 0;

  constructor(public alertController: AlertController,private routerOutlet: IonRouterOutlet,public modalController: ModalController,private iab: InAppBrowser,private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController,private stripe: Stripe,private payPal: PayPal){

   this.data    = JSON.parse(localStorage.getItem('checkout_data'));
   this.setting = JSON.parse(localStorage.getItem('setting'));
   this.text    = JSON.parse(localStorage.getItem('app_text'));
   this.stripe_id = this.setting.stripe_key;
   this.razor_id = this.setting.razor_key;
   this.cod     = this.setting.cod == 0 ? true : false;
   this.getDate();

  }

  getTotal()
  {
    if(this.otype == 2)
    {
      return (this.data.total - this.data.d_charges) + (this.tip*1);
    }
    else
    {
      return (this.data.total) + (this.tip*1);
    }
  }

  totalPayable()
  {    
    return (this.getTotal() - this.ecash) + (this.tip*1);
  }

  getDate()
  {
    var today:any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    this.todayDate = today;

    console.log(this.todayDate);
  }

  ngOnInit()
  {
  }

  ionViewWillEnter()
  {
    this.loadData();
  }

 
async loadData()
{
  const loading = await this.loadingController.create({
    message: '',
    spinner:'bubbles'
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id'),this.data.data[0].store_id,localStorage.getItem('cart_no')).subscribe((response:any) => {

    this.address = response.address;
    this.user    = response.data;
    this.wallet  = this.user.wallet;
    this.api     = response.api;
    this.dates   = response.dates;
    this.times   = response.times;
    this.tips    = response.tip;

    localStorage.setItem("years",JSON.stringify(response.year));

    if(response.stock == false)
    {
      this.presentToast(this.text.out_stock_msg_checkout);

      this.nav.navigateBack('/cart');
    }

    if(response.store.delivery_by == 1)
    {
      this.cod = response.store.cod == 1 ? true : false;
    }

    if(response.store.stripe_key)
    {
      this.stripe_id = response.store.stripe_key;
    }

    if(response.store.razor_key)
    {
      this.razor_id = response.store.razor_key;
    }

    loading.dismiss();

    });
  }

  setAddress(a)
  {
    this.address_id = a.id;
    this.addressName = a.address;

    localStorage.setItem("current_lat",a.lat);
    localStorage.setItem("current_lng",a.lng);

    this.presentToast(this.text.d_charge_msg);

    this.server.getCart(localStorage.getItem('cart_no')).subscribe((response:any) => {

    this.data = response.data;

    console.log(this.data);

    });
  }

  async book()
  {
    const loading = await this.loadingController.create({
      spinner : 'bubbles',
      duration:3000
      
    });
    await loading.present();

    var allData = {
      
      payment     : this.payment,
      cart_no     : localStorage.getItem('cart_no'),
      payment_id  : this.payment_id,
      otype       : this.otype,
      odate       : this.odate,
      order_date  : this.order_date,
      order_time  : this.order_time,
      user_id     : localStorage.getItem('user_id'),
      address     : this.address_id,
      ecash       : this.ecash,
      comment     : localStorage.getItem('cooking_notes'),
      tip         : this.tip
    }
    
    this.server.order(allData).subscribe((response:any) => {
  	
    localStorage.setItem('order_data', JSON.stringify(response.data));
    localStorage.removeItem("cooking_notes");
  
   if(this.payment == 6)
   {
      this.payGiroPay(response.data.data.token,6);
   }
   else if(this.payment == 7)
   {
     this.payGiroPay(response.data.data.token,7);
   }
   else if(this.payment == 2)
   {
     this.payGiroPay(response.data.data.token,2);
   }
   else
   {
       this.nav.navigateRoot('/detail/'+response.data.data.id);

      if(this.data.store.whatsapp_new_order == 0)
      {
        this.presentAlertConfirm(response.data.data.id);
      }
   }

    loading.dismiss();

    });
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode:'ios',
      header: 'Order Placed Successfully',
      message: 'You can send a copy of this order to the store`s whatsapp number if you want to ask them order status or delivery time.',
      buttons: [
        {
          text: 'Send',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          this.nav.navigateRoot('/detail/'+id);

          this.sendWhatsapp();

          }
        }, {
          text: 'Close',
          handler: () => {
        
          this.nav.navigateRoot('/detail/'+id);

          }
        }
      ]
    });

    await alert.present();
  }

  sendWhatsapp()
  {
     var itemName = "Hi *"+this.data.store.name+"* Please note my order details.\n\n";

     //items detail
     for(var i = 0;i<this.data.data.length;i++)
     {
       var name = this.data.data[i].qtyName ? this.data.data[i].qtyName : "";
       var price = this.data.data[i].price * this.data.data[i].qty;
       itemName = itemName + this.data.data[i].item+" - "+this.data.data[i].qty+" "+name+" - "+this.setting.currency+price+" \n\n";

       if(this.data.data[i].addon.length > 0)
       {
         for(var a = 0;a<this.data.data[i].addon.length;a++)
         {
          itemName = itemName + "----"+this.data.data[i].addon[a].name+" - "+this.setting.currency+this.data.data[i].addon[a].price+"\n\n";
         }
       }

     }  

     if(this.odate == 1)
     {
      var o_date_time = "Today";
     }
     else
     {
       var o_date_time = this.order_date+" "+this.order_time;
     }

     var order_type = this.otype == 1 ? "Delivery" : "Pickup";

     //other detail
     itemName = itemName +"*Order Type* : "+order_type;
     itemName = itemName +"\n\n*Order Delivery Date Time* : "+o_date_time;
     itemName = itemName +"\n\n*User Detail*";
     itemName = itemName +"\n*Name* : "+this.user.name;
     itemName = itemName +"\n*Phone* : "+this.user.phone;

     if(this.otype == 1)
     {
       itemName = itemName +"\n*Address* : "+this.addressName;
     }

     if(this.comment)
     {
       itemName = itemName +"\n*Notes* : "+this.comment;
     }

     if(this.payment == 1)
     {
      var pm = "Cash on Delivery";
     }
     else
     {
       var pm = "Online Paid (Transaction id : "+this.payment_id+")";
     }

     itemName = itemName +"\n\n\n*Total Amount* : "+this.setting.currency+this.getTotal();

     if(this.otype == 1 && this.data.d_charges > 0)
     {
      itemName = itemName +"\n\n\n*Delivery Charges* : "+this.setting.currency+this.data.d_charges;
     }

     itemName = itemName +"\n\n*Payment Method* : "+pm;

     window.location.href = "https://wa.me/"+this.data.store.whatsapp+"?text="+encodeURI(itemName);
  }

  makeOrder()
  {
    if(this.payment == 2)
    {
      this.book();
    }
    else if(this.payment == 3)
    {
      this.payWithRazor();
    }
    else if(this.payment == 4)
    {
      this.payPaypal();
    }
    else if(this.payment == 5)
    {
      this.payStack();
    }
    else if(this.payment == 6)
    {
      this.book();
    }
    else if(this.payment == 7)
    {
      this.book();
    }
    else
    {
      this.book();
    }
  }

  payWithStripe()
  {    
    var cNo = this.card_no;

    if(cNo && cNo.length == 16 && this.exp_month.length == 2 && this.exp_year.length == 4 && this.cvv.length == 3)
    {
        this.stripe.setPublishableKey(this.stripe_id);

        let card = {
         number: cNo,
         expMonth: this.exp_month,
         expYear: this.exp_year,
         cvc: this.cvv
        }

      console.log(card);


        var cardNo        = false;
        var cvvCorrect    = false;

        //validate card no
        this.stripe.validateCardNumber(cNo)
          .then(res => {
            
          
          this.stripe.createCardToken(card)
            .then(token => {
              
              if(token.id)
              {
                this.makePayment(token.id,cNo);
              }
              else
              {
                this.presentToast(this.text.card_no_validation);
              }

            })
            .catch(error => {

            this.presentToast(this.text.stripe_config);

            });


          })
          .catch(error => {

          this.presentToast(this.text.card_no_validation);

          });
    }
    else
    {
      this.presentToast(this.text.stripe_validation);
    }
  }

  async makePayment(token,cNo)
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loading.present();

    this.server.makeStripePayment("?token="+token+"&amount="+this.getTotal()+"&user_id="+this.phone+'&store_id='+this.data.data[0].store_id).subscribe((response:any) => {

    if(response.data == "done")
    {
        this.payment_id = response.id;

        if(this.payment_id)
        {
          this.book();
        }
    }
    else
    {
      this.presentToast(response.error);
    }

    loading.dismiss();

    });
  }


  payWithRazor() {
    var options = {
      description: 'Pay Now',
      image: 'https://cdn.iconscout.com/icon/free/png-512/bhim-3-69845.png',
      currency: this.setting.currency_code,
      key: this.razor_id,
      amount: this.getTotal() * 100,
      name: 'Food Order App',
      prefill: {
        email: this.name+"@google.com",
        contact: this.phone,
        name: this.name
      },
      theme: {
        color: '#2196f3'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = (success)=> {
      
      this.payment_id = success;

      if(this.payment_id)
      {
        this.book();
      }

    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
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

  
  allSet()
  {
    if(this.otype && this.odate)
    {
      if(this.totalPayable() > 0 && !this.payment)
      {
        return false;
      }

      if(this.otype == 1 && this.odate == 1 && this.address_id)
      {
        return true
      }
      else if(this.otype == 2 && this.odate == 1)
      {
        return true;
      }
      else if(this.otype == 2 && this.odate == 2 && this.order_time && this.order_date)
      {
        return true;
      }
      else if(this.otype == 1 && this.odate == 2 && this.address_id && this.order_date && this.order_time)
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  payPaypal()
  {
    this.payPal.init({
      PayPalEnvironmentProduction: this.setting.paypal_id,
      PayPalEnvironmentSandbox: this.setting.paypal_id
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.getTotal(), 'USD', 'Food Delivery App', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          
        this.book();


        }, () => {
          
        this.presentToast(this.text.paypal_fail);

        });
      }, () => {
        
      this.presentToast(this.text.paypal_wrong);

      });
    }, () => {
      
      this.presentToast(this.text.paypal_wrong);


    });
  }

  payStack()
{
    var query:any = "?name="+this.user.name+"&phone="+this.user.phone+"&email="+this.user.email+"&amount="+this.getTotal();
    var paymetUrl  = this.api+"/payStack"+query;
    var successUrl = this.api+"/payStackSuccess";
    var failUrl    = this.api+"/payStackCancel"

    const browser = this.iab.create(paymetUrl,"_blank",{zoom : 'no',location : 'no',toolbar :'no'});

    browser.on('loadstop').subscribe(event => {
       
    if(event.url === successUrl)
    {
       this.book();

       browser.close();

    }
    else if(event.url === failUrl)
    {
       this.presentToast(this.text.pay_cancel);

       browser.close();   
    }

    });

    browser.show();
}

payGiroPay(id,type)
{
    var query:any = "?id="+id;
    
    if(type == 7)
    {
      var paymetUrl  = this.api+"/idel"+query;
      var successUrl = this.api+"/idelSuccess";
      var failUrl    = this.api+"/idelFail"
    }
    else if(type == 2)
    {
      var paymetUrl  = this.api+"/stripeCredit"+query;
      var successUrl = this.api+"/stripeCreditSuccess";
      var failUrl    = this.api+"/stripeCreditFail"
    }
    else
    {
      var paymetUrl  = this.api+"/giro"+query;
      var successUrl = this.api+"/giroSuccess";
      var failUrl    = this.api+"/giroFail"
    }

    const browser = this.iab.create(paymetUrl,"_self",{zoom : 'no',location : 'no',toolbar :'no'});

    browser.on('loadstop').subscribe(event => {
       
    if(event.url === successUrl)
    {
       this.book();

       browser.close();

    }
    else if(event.url === failUrl)
    {
       this.presentToast(this.text.pay_cancel);

       browser.close();   
    }

    });

    browser.show();
}

async getPaymentMethod() {
    const modal = await this.modalController.create({
      component: PaymentPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        
        'total'  : this.getTotal(),
        'wallet' : this.wallet,
        'user'   : this.user
      }

    });

   modal.onDidDismiss().then(data=>{
    
    if(data.data)
    {
      this.payment    = data.data.payment;
      this.hasEcash   = data.data.hasEcash;
      this.card_no    = data.data.card_no;
      this.exp_month  = data.data.exp_month;
      this.exp_year   = data.data.exp_year;
      this.cvv        = data.data.cvv;

      //if used ecash
      if(this.hasEcash == true)
      {
        if(this.wallet > this.getTotal())
        {
          this.ecash  = this.getTotal();
          this.wallet = this.wallet - this.ecash;
        }
        else
        {
          this.ecash  = this.wallet;
          this.wallet = 0; 

          console.log(this.ecash);
        }
      }
      else
      {
        this.wallet = this.user.wallet;
        this.ecash  = 0;
      }
    }

    })

    return await modal.present();
  }

  async getAddress() {
    const modal = await this.modalController.create({
      component: SelectAddressPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:true,
      swipeToClose: true,
      componentProps: {
        
        'address'  : this.address,
      }

    });

   modal.onDidDismiss().then(data=>{
    
    if(data.data)
    {
      this.setAddress(data.data.address);
    }

    })

    return await modal.present();
  }

  async addTip() {
    const modal = await this.modalController.create({
      component: TipPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:true,
      swipeToClose: true,
      breakpoints: [0, 0.3, 0.5, 0.5],
      initialBreakpoint: 0.2,
      componentProps: {
        
        'tips'  : this.tips,
      }

    });

   modal.onDidDismiss().then(data=>{
    
    if(data.data)
    {
      this.tip = data.data.tip;
    }

    })

    return await modal.present();
  }

  removeTip()
  {
    this.tip = null;
  }
}
