import { Request, Router, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware';
import { register, login } from './user.validation';
import UserService from './user.service';
import authenticated from '../../middleware/authenticated.middleware';

export default class userController implements Controller {
  public path = '/users';
  public router = Router();
  public userService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(register),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(login),
      this.login
    );

    this.router.get(`${this.path}`, authenticated, this.getUser);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;
      console.log(this);
      const token = await this.userService.register(
        name,
        email,
        password,
        'user'
      );
      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      console.log(this);

      const token = await this.userService.login(email, password);

      res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        return next(new HttpException(400, 'no logged in user'));
      }
      res.status(200).json({ user: req.user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}
