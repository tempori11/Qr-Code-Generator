import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  /* async login() {
    try {
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      this.router.navigateByUrl('/qr-generator');
    } catch (error) {
      if (error instanceof Error) {
        this.showAlert('Login Failed', error.message);
      } else {
        this.showAlert('Login Failed', 'An unknown error occured.');
      }
    }
  } */

  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      const userUid = userCredential.user?.uid;
      console.log('Logged in User UID:', userUid);

      if (userUid) {
        this.sendUserUidToApi(userUid).subscribe({
          next: (response) => {
            console.log('User UID sent to API:', response);
          },
          error: (error) => {
            console.error('Error sending User UID to API:', error);
          },
          complete: () => {
            console.log('API call completed.');
          },
        });
      }

      // Navigate to the desired page after successful login and UID sending
      this.router.navigateByUrl('/qr-generator');
    } catch (error) {
      if (error instanceof Error) {
        this.showAlert('Login Failed', error.message);
      } else {
        this.showAlert('Login Failed', 'An unknown error occurred.');
      }
    }
  }

  sendUserUidToApi(userUid: string) {
    const apiUrl = 'http://localhost:5208/Users/user_uid';
    return this.http.post(apiUrl, { Uid: userUid });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
