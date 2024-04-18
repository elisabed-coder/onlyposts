import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './posts/interfaces/post.interface';
import { User } from './posts/interfaces/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Postservice implements OnInit {
  private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>(
    []
  );
  public posts$: Observable<Post[]> = this.postsSubject.asObservable();
  public users: User[] = [];
  public posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.getUsers().subscribe((users) => (this.users = users));
    this.getPosts().subscribe((posts) => this.postsSubject.next(posts));
  }

  ngOnInit(): void {
    this.getUsers().subscribe((user) => {
      this.users = user;
      console.log(this.users);
    });
    this.getPosts().subscribe((post) => {
      this.posts = post;
      console.log(this.posts);
    });
  }

  getUsers() {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
  getPosts(): Observable<Post[]> {
    return forkJoin({
      posts: this.http.get<Post[]>(
        'https://jsonplaceholder.typicode.com/posts'
      ),
      users: this.getUsers(),
    }).pipe(
      map(({ posts, users }) => {
        // Map posts array to include user names
        return posts.map((post) => ({
          ...post,
          name: users.find((user) => user.id === post.userId)?.name,
        }));
      })
    );
  }

  getUserById(userId: number | undefined): string {
    const user = this.users.find((user) => user.id === userId);
    return user ? user.name || '' : '';
  }

  getPostById(postId: number | undefined): Observable<Post | undefined> {
    return this.posts$.pipe(
      map((posts) => posts.find((post) => post.id === postId))
    );
  }
  CreateTask(data: any) {
    return this.http.post<any>(
      'https://jsonplaceholder.typicode.com/posts',
      data
    );
  }

  updatePost(updatedPost: Post | undefined): Observable<Post | undefined> {
    if (!updatedPost || updatedPost.id === undefined) {
      return throwError('Invalid post or post ID');
    }

    const url = `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`;
    return this.http.put<Post>(url, updatedPost);
  }
}

// public postMethod() {
//   let body = {
//     title: 'g',
//     body: 'g',
//     userid: 1,
//   };
//   this.http
//     .post('https://jsonplaceholder.typicode.com/posts', body)
//     .subscribe((data) => {
//       this.PostJSonValue = data;
//     });
// }
