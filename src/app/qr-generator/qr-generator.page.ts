import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.page.html',
  styleUrls: ['./qr-generator.page.scss'],
})
export class QrGeneratorPage implements OnInit {
  qrData: string | null = null;
  userData: any;
  userId: string | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router
  ) {
    /* this.qrData = 'IUuHpYzVBsODHTY4ycVqVRszGnC2'; */
  }

  ngOnInit(): void {
    /* const userId = 'IUuHpYzVBsODHTY4ycVqVRszGnC2';
    this.firestoreService.getUserData(userId).subscribe((data) => {
      this.userData = data; */

    this.authService.getUserId().subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.qrData = userId;
        this.fetchUserData(userId);
      } else {
        // Handle user not logged in
        console.log('User not logged in');
      }
    });
  }

  fetchUserData(userId: string): void {
    this.firestoreService.getUserData(userId).subscribe((data) => {
      this.userData = data;
    });
  }

  goToAddBalance(): void {
    this.router.navigate(['/add-balance']);
  }
}
