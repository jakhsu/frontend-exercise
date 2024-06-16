export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  date: string;
  tags: string[];
}

export interface AllPostResponse {
  data: Post[];
  limit: number;
  page: number;
  totalPages: number;
  totalPosts: number;
}

export interface Account {
  userId: string;
  username: string;
  email: string;
  password: string;
  role: string;
}
