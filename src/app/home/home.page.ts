import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,AlertController,ModalController,IonRouterOutlet,ActionSheetController } from '@ionic/angular';
import { MenuPage } from '../menu/menu.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
@ViewChild('content',{static : false}) private content: any;

  BannerOption = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: true,
    centeredSlides: true,
    autoplay:false,
    speed: 500,
    spaceBetween:0,

  }

  CateOption = {
    initialSlide: 0,
    slidesPerView: 3.2,
    loop: true,
    centeredSlides: false,
    autoplay:false,
    speed: 500,
    spaceBetween:-90,

  }

  TrendOption = {
    initialSlide: 0,
    slidesPerView: 2.2,
    loop: true,
    centeredSlides: false,
    autoplay:false,
    speed: 500,
    spaceBetween:0,

  }

  sl:any = [1,2,3,4,5];

  data:any;
  fakeData = [1,2,3,4,5,6,7];
  subscription:any;
  text:any;
  address:any;
  storeData:any = [];
  allData:any;
  filterPress:any;
  stores:any;
  store_type = 0;
  filterName:any;
  cate_id:any;
  cate_name:any;

  constructor(public actionSheetController: ActionSheetController,private routerOutlet: IonRouterOutlet,public modalController: ModalController,private activatedRoute: ActivatedRoute,public server : ServerService,public loadingController: LoadingController,public alertController: AlertController,public platform : Platform,public nav : NavController) {

   this.text = JSON.parse(localStorage.getItem('app_text'));
   this.address = localStorage.getItem('current_add');
  }

  ngOnInit()
  {
  	this.loadData();
  }

  cateData(cate)
  {
    this.cate_id = cate.id;
    this.cate_name = cate.name;
    this.data = null;
    this.loadData(cate.id);
  }

  clearCate()
  {
    this.cate_id    = null;
    this.cate_name  = null;
    this.data       = null;
    this.loadData();
  }

  viewAll()
  {
    setTimeout(() => {

    const element = document.getElementById("store");
     element.scrollIntoView({behavior: "smooth"});

    },200);
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
      header: this.text.exit_app,
      message: this.text.exit_app_desc,
      buttons: [
        {
          text: this.text.s_canceled_order,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.text.exit_app_confirm,
          handler: () => {
          
            navigator['app'].exitApp();

          }
        }
      ]
    });

    await alert.present();
}
  
  setType()
  {    
    this.storeData = [];

    for(var i = 0;i<this.data.store.length;i++)
    {
      if(this.store_type == 0)
      {
        if(this.data.store[i].delivery == 0)
        {
          this.storeData.push(this.data.store[i]);
        }
      }
      else
      {
        if(this.data.store[i].dinein == 0)
        {
          this.storeData.push(this.data.store[i]);
        }
      }
    }

    setTimeout(() => {

    const element = document.getElementById("store");
     element.scrollIntoView({behavior: "smooth"});

    },200);
  }

  async loadData(id = 0,load = false)
  {
    this.server.homepage(id,this.store_type).subscribe((response:any) => {
  
    this.data       = response.data;
    this.storeData  = response.data.store;
    this.allData    = response.data.store;

    console.log(this.data);

    if(id > 0 && this.data || load)
    {
      setTimeout(() => {

      const element = document.getElementById("store");
      element.scrollIntoView({behavior: "smooth"});

      },200);
    }

    localStorage.setItem('app_text', JSON.stringify(response.data.text));

    localStorage.setItem('setting', JSON.stringify(response.data.setting));

    localStorage.setItem('country', JSON.stringify(response.data.country));

    });
  }

  item(store)
  {
    if(store.open)
    {
      this.nav.navigateForward('/item/'+store.id+'/'+this.store_type);
    }
  }

  search()
  {
    localStorage.setItem('trend_data', JSON.stringify(this.data.trend));
    localStorage.setItem('all_data', JSON.stringify(this.data.search_data));

    this.nav.navigateForward('/search');
  }

account()
{
  if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != "null")
  {
    this.nav.navigateForward('/account');
  }
  else
  {
    this.nav.navigateForward('/login');
  }
}

bannerLink(banner)
{
  if(banner.link_to == 1)
  {
    this.nav.navigateForward('/item/'+banner.link_id);
  }
  else if(banner.link_to == 2)
  {
    this.data = null;
    this.loadData(banner.link_id);
  }
  else if(banner.link_to == 3)
  {
    window.open(banner.link_id, "_blank");
  }
}

filterData(id)
{  
  //this.stores = this.storeData;

  this.filterPress = id;

  if(id == 0)
  {
    this.filterPress = null;
  }
  else if(id == 1)
  {
    this.filterName = this.text.rating;

     this.storeData.sort((a,b) => {
        
        return parseFloat(b.rating) - parseFloat(a.rating);

        });
  }
  else if(id == 2)
  {
    this.filterName = this.text.nearest;

    this.storeData.sort((a,b) => {
    
        return parseFloat(a.km) - parseFloat(b.km);

      });
  }
  else if(id == 3)
  {
        this.filterName = this.text.new_arrival;

        this.storeData.sort((a,b) => {
    
        return parseFloat(b.id) - parseFloat(a.id);

        });
  }
  else
  {
    this.filterName = "Fastest Delivery";

    this.storeData.sort((a,b) => {
    
        return parseFloat(a.dtime) - parseFloat(b.dtime);

        });
  }

  setTimeout(() => {

    if(id > 0)
    {
      const element = document.getElementById("store");
      element.scrollIntoView({behavior: "smooth"});
    }

    },200);
}

doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
     this.loadData();
      event.target.complete();
    }, 2000);
  }

async showMenu() {
    const modal = await this.modalController.create({
      component: MenuPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-modal-css',
      backdropDismiss:false,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        
        'user'  : this.data.user,
      }
      
    });

   modal.onDidDismiss().then(data=>{
        
    if(data.data.logout)
    {
      this.loadData();
    }

    })

    return await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter By',
      cssClass: 'my-custom-class',
      mode:'md',
      buttons: [{
        text: this.text.rating,
        role: 'destructive',
        icon: 'star-outline',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
        
        this.filterData(1);

        }
      }, {
        text: this.text.nearest,
        icon: 'location-outline',
        data: 10,
        handler: () => {
          this.filterData(2);
        }
      }, {
        text: this.text.new_arrival,
        icon: 'checkmark-done-outline',
        data: 'Data value',
        handler: () => {
          this.filterData(3);
        }
      }, {
        text: 'Fastest Delivery',
        icon: 'rocket-outline',
        handler: () => {
          this.filterData(4);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
