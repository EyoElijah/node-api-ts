import PostModel from '../post/post.model';
import Post from '../post/post.interface';

export default class PostService {
  private post = PostModel;
  /**
   * Create a new post
   */
  public async create(title: string, body: string): Promise<Post> {
    try {
      const post = this.post.create({ title, body });
      return post;
    } catch (error) {
      throw new Error('unable to create post');
    }
  }
}
