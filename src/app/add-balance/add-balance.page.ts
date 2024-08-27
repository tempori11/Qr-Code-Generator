import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.page.html',
  styleUrls: ['./add-balance.page.scss'],
})
export class AddBalancePage implements OnInit {
  addBalanceForm: FormGroup;
  userId: string | null = null;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private router: Router
  ) {
    this.addBalanceForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.authService.getUserId().subscribe((userId) => {
      if (userId) {
        this.userId = userId;
      } else {
        console.log('User not logged in');
      }
    });
  }

  addBalance() {
    if (this.userId && this.addBalanceForm.valid && !this.isProcessing) {
      const amount = this.addBalanceForm.value.amount;
      this.isProcessing = true;

      // Fetch the current user data from Firestore
      this.firestoreService
        .getUserData(this.userId)
        .pipe(take(1))
        .subscribe((userData) => {
          if (userData) {
            // Calculate the new balance
            const newBalance = userData.balance + amount;

            if (this.userId) {
              // Update the balance in Firestore
              this.firestoreService
                .updateUserBalance(this.userId, newBalance)
                .then(() => {
                  // Navigate back to the QR generator page after successful update
                  this.router.navigate(['/qr-generator']);
                })
                .catch((error) => {
                  console.error('Error updating balance: ', error);
                  // Handle errors if necessary
                });
            }
          } else {
            console.error('User data not found');
            // Handle case where user data is not found
          }
        });
    }
  }
}
