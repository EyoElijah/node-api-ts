import UserModel from './user.model';
import { createToken } from '../../utils/token';

class UserService {
  private user = UserModel;
  /**
   *  Register a user
   * @param name : string
   * @param email : string
   * @param password :string
   * @param role : string
   * @returns accessToken
   */
  public async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({
        name,
        email,
        password,
        role,
      });
      // console.log(user);
      const accessToken = createToken(user);
      return accessToken;
    } catch (error) {
      throw new Error('unable to create user');
    }
  }

  /**
   * Login a user
   * @param email : string,
   * @param password : string
   * @returns createToken(user)
   */
  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) throw new Error('unable to find user');
      if (await user.isValidPassword(password)) {
        return createToken(user);
      }
      throw new Error(' Wrong credentials');
    } catch (error) {
      throw new Error('unable to login user');
    }
  }
}

export default UserService;
