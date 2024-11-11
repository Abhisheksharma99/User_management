import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.css'
})
export class UserDetailDialogComponent {
  firstName: string;
  lastName: string;

  constructor(
    public dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  public save(): void {
    this.dialogRef.close({ ...this.user, firstName: this.firstName, lastName: this.lastName });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
