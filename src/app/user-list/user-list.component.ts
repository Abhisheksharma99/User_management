import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [HttpClientModule, MatDialogModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: any[] = [];

  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data.data.members.map((member: any) => member.user);
    });
  }

  public openDialog(user: any): void {
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        this.userService.updateUser(updatedUser.userId, updatedUser.firstName, updatedUser.lastName).subscribe(() => {
          // Update the user in the local users array
          const userIndex = this.users.findIndex(u => u.userId === updatedUser.userId);
          if (userIndex !== -1) {
            this.users[userIndex] = updatedUser;
          }
        });
      }
    });
  }
}
