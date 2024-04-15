import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Post } from './interfaces/post.interface';
import { Postservice } from '../posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  currentTaskId!: number;
  selectedTask!: Post | null;
  editMode: boolean = false;

  users: User[] = [];
  posts: Post[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    public postservice: Postservice
  ) {}

  ngOnInit(): void {
    console.log('PostsComponent initialized');
    this.fetchallData();
    this.postservice.posts$.subscribe((posts) => {
      this.posts = posts;
    });
  }

  fetchallData() {
    this.postservice.getUsers().subscribe((users) => {
      this.users = users;
      localStorage.setItem('users', JSON.stringify(this.users));
      this.postservice.users = this.users;
    });
    this.postservice.fetchPosts(); // Use service method to fetch posts
  }

  getUserById(userId: number | undefined): string {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.name || '' : '';
  }

  openEditPost(postId: number) {
    this.editMode = true; // Set editMode to true

    this.router.navigate(['/posts', postId]);
  }

  editPost(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate([`posts/${id}`]);
    }
    this.selectedTask = this.posts.find((post) => post.id === id) || null; // Assign the post with the matching id, or null if not found
  }

  updatePost(updatedPost: Post) {
    // Find the index of the post in the `posts`
    console.log(updatedPost);
    const index = this.posts.findIndex((post) => post.id === updatedPost.id);

    if (index !== -1) {
      // Update the post in the `posts` array
      this.posts[index] = updatedPost;
    }
  }
}
