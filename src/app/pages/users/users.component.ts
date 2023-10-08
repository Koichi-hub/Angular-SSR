import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { lastValueFrom } from 'rxjs';

type User = {
  name: string;
  email: string;
};

type Data = {
  users: User[];
  total: number;
};

const usersStateKey = makeStateKey('users');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient, private transferState: TransferState) {}

  async ngOnInit() {
    await this.fetchUsers();
  }

  fetchUsers = async () => {
    this.users = this.transferState.get(usersStateKey, <any>[]);

    if (this.users.length === 0) {
      const response = await lastValueFrom(
        this.http.get('http://localhost:3000/api/users')
      );

      this.users = (response as Data).users;
      this.transferState.set(usersStateKey, <any>this.users);
    }
  };
}
