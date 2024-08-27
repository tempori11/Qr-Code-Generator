import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}

  getUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  sendUserUidToApi(userUid: string) {
    const apiUrl = 'http://localhost:5208/Users/user_uid';
    return this.http.post(apiUrl, { Uid: userUid });
  }

  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((UserCredential) => {
        const userUid = UserCredential.user?.uid;
        console.log('Logged in business UID', userUid);
        if (userUid) {
          this.sendUserUidToApi(userUid).subscribe(
            (response) => {
              console.log('User UID sent to API:', response);
            },
            (error) => {
              console.error('Error sending User UID to API', error);
            }
          );
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  }
}
