import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly config: MatSnackBarConfig = {
    duration: 5000,
  };

  constructor(private snackBar: MatSnackBar) {}

  open(message: string): void {
    this.snackBar.open(message, 'Close', this.config);
  }
}
