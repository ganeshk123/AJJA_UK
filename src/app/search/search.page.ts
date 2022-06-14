import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,AlertController } from '@ionic/angular';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage {

data:any
text:any;
trend:any;
store:any;
q:any;
search = false;
fakeData = [1,2,3,4,5,6,7];
searchQ:any;
search_query:any = [];

  constructor(public platform : Platform,public loadingController: LoadingController,public server : ServerService,private nav: NavController,public toastController: ToastController,public alertController: AlertController) {

   this.text  = JSON.parse(localStorage.getItem('app_text'));
   this.trend = JSON.parse(localStorage.getItem('trend_data'));
   this.store = JSON.parse(localStorage.getItem('all_data'));

   if(localStorage.getItem('search_query') && localStorage.getItem('search_query') != undefined && localStorage.getItem('search_query') != "null")
   {
      this.search_query = JSON.parse(localStorage.getItem('search_query'));
   }
  }

  ngOnInit()
  {
  	
  }

  ionViewWillEnter()
  {
  }

  clearSearch()
  {
    localStorage.removeItem("search_query");

    this.search_query = [];
  }

  search_again(t)
  {
    this.q = t;
  }

  save(e)
  {
    if(this.search_query)
    {
      var search_array:any = this.search_query;
    }
    else
    {
      var search_array:any = [];
    }

    search_array.push(e.target.value);

    if(search_array.length > 0)
    {
      localStorage.setItem("search_query",JSON.stringify(search_array));
    }
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

  searchPage(s)
  {    
    if(s.item == false)
    {
     this.nav.navigateForward('/item/'+s.id+"/0");
    }
    else
    {
      this.search = true;
      this.searchData(s.id);
      this.searchQ = s.name;
    }
  }

  async searchData(id)
  {        
    this.server.getSearch(id).subscribe((response:any) => {
  
    this.data    = response.data;
    this.search  = false;

    });
  }

  item(store)
  {
    if(store.open)
    {
      this.nav.navigateForward('/item/'+store.id+'/0');
    }
  }
}
