import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { OptionPageModule } from './option/option.module';
import { OfferPageModule } from './offer/offer.module';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { MenuPageModule } from './menu/menu.module';
import { NotePageModule } from './note/note.module';
import { PaymentPageModule } from './payment/payment.module';
import { SelectAddressPageModule } from './select-address/select-address.module';
import { TipPageModule } from './tip/tip.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    OptionPageModule,
    OfferPageModule,
    MenuPageModule,
    NotePageModule,
    PaymentPageModule,
    SelectAddressPageModule,
    TipPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    OneSignal,
    NativeGeocoder,
    Geolocation,
    PayPal,
    InAppBrowser,
    PhotoViewer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
