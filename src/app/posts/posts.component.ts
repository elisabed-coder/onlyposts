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
  showCreateTaskForm: boolean = false;
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
  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CreateTask(data: Post) {
    this.postservice.CreateTask(data).subscribe(
      (response) => {
        console.log(response);

        this.users = [
          {
            id: response.userId,
            name: response.name,
          },
          ...this.users,
        ];
        console.log(this.users);

        // Fetch the user's name based on userId
        const userName = this.getUserById(response.userId);

        // Adjust IDs of existing posts
        this.posts.forEach((post) => {
          post.id++;
        });

        // Construct the new post object
        const newPost: Post = {
          userId: response.userId,
          id: 1, // Use the ID 1 for the new post
          title: response.title,
          body: response.body,
          name: userName, // Use the fetched user's name
        };

        // Add the new post at the beginning of the posts array
        this.posts.unshift(newPost);
        console.log(newPost);
      },

      (error) => {
        console.error('Error creating task:', error);
      }
    );
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
