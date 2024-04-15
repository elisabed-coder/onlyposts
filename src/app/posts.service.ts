import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './posts/interfaces/post.interface';
import { User } from './posts/interfaces/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Postservice implements OnInit {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$: Observable<Post[]> = this.postsSubject.asObservable();

  users: User[] = [];
  posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {
    // const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    // this.postsSubject.next(storedPosts);
  }

  fetchPosts() {
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe((posts) => {
        this.postsSubject.next(posts);
      });
  }
  ngOnInit(): void {
    this.getUsers().subscribe((users) => {
      this.users = users;
      localStorage.setItem('users', JSON.stringify(this.users));
    });
    this.getPosts().subscribe((posts) => {
      this.posts = posts;
      localStorage.setItem('posts', JSON.stringify(this.posts)); // Save users array to local storage
    });
  }

  getUsers() {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
  getPosts() {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }

  getUserById(userId: number | undefined): string {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.name || '' : '';
  }

  getPostById(id: number): Post | undefined {
    const posts = this.postsSubject.getValue();
    return posts.find((post) => post.id === id);
  }

  updatePost(updatedPost: Post): void {
    const posts = this.postsSubject.getValue();
    const index = posts.findIndex((post) => post.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      this.postsSubject.next(posts);
    }
  }
}
