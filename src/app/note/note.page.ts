import { Component } from '@angular/core';
import { NavController,Platform,LoadingController,IonSlides,ToastController,ModalController } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: 'note.page.html',
  styleUrls: ['note.page.scss'],
})
export class NotePage {

text:any;
notes:any;

constructor(public loadingController: LoadingController,public server : ServerService,private route: ActivatedRoute,public nav : NavController,public toastController: ToastController,public modalController: ModalController) {

this.text = JSON.parse(localStorage.getItem('app_text'));

}

  ngOnInit()
  {
    
  }

  async saveData()
  {
    if(this.notes && this.notes.length > 0)
    {
      await this.modalController.dismiss({notes:this.notes});
    }
  }

}
