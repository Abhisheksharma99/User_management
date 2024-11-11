import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.com/users'; // Dummy api url

  private usersData = {
    data: {
      memberCount: 3,
      members: [
        {
          user: {
            created: '2022-03-14T12:29:27.446531Z',
            email: 'hermann@supercomp.com',
            firstName: 'hermann',
            lastName: 'mustermann',
            userId: 'e0250d1c-773e-4f6c-a64d-11587488e222'
          }
        },
        {
          user: {
            created: '2022-03-14T10:49:55.143462Z',
            email: 'klaus@supercomp.com',
            firstName: 'klaus',
            lastName: 'mustermann',
            userId: 'c9a228e9-47dd-4082-bdca-4de48d0c0917'
          }
        },
        {
          user: {
            created: '2022-03-14T10:49:55.143462Z',
            email: 'fritz@supercomp.com',
            firstName: 'fritz',
            lastName: 'mustermann',
            userId: 'c9a228e9-47dd-4082-bdca-4de48d0c0918'
          }
        }
      ]
    }
  };

  private usersSubject = new BehaviorSubject<any>(this.usersData);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((response) => {
        this.usersSubject.next(response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API error; falling back to hardcoded data:', error.message);
        this.usersSubject.next(this.usersData);
        return of(this.usersData);
      })
    );
  }

  updateUser(userId: string, firstName: string, lastName: string): Observable<any> {
    const updateData = { firstName, lastName };

    return this.http.put(`${this.apiUrl}/${userId}`, updateData).pipe(
      tap(() => {
        console.log(`Successfully updated user with ID: ${userId}`);
        this.updateLocalUserData(userId, firstName, lastName); // Update local data if successful
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API error on update; updating hardcoded data locally:', error.message);
        this.updateLocalUserData(userId, firstName, lastName); // Update local data if failed
        return of(this.usersData);
      })
    );
  }

  private updateLocalUserData(userId: string, firstName: string, lastName: string): void {
    const updatedMembers = this.usersData.data.members.map((member) => {
      if (member.user.userId === userId) {
        console.log(`Updating local data for user with ID: ${userId}`);
        return {
          user: {
            ...member.user,
            firstName,
            lastName
          }
        };
      }
      return member;
    });
    this.usersData.data.members = updatedMembers;
    this.usersSubject.next(this.usersData);
  }
}
