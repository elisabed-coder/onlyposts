import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Post } from './interfaces/post.interface';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Postservice } from '../posts.service';
import { AnimationPlayer } from '@angular/animations';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  public users: User[] = [];
  public posts: Post[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    public postservice: Postservice
  ) {}

  ngOnInit(): void {
    this.postservice.getUsers().subscribe((users) => {
      this.users = users;
      console.log(this.users);
    }),
      this.postservice.posts$.subscribe((posts) => {
        this.posts = posts;
      });
    this.postservice.getPostById;
  }
  getUserById(userId: number | undefined): string {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.name || '' : '';
  }
  gotoEdit(post: Post) {
    console.log(post);
    this.router.navigate(['edit', post.id]);
  }
}
