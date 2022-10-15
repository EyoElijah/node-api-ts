import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from './utils/interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import helmet from 'helmet';

dotenv.config();
class App {
  public app: Application;
  public port: number;

  public mongoUrl = String(process.env.MONGO_URI);

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initailizeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
  }
  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware);
  }
  private initailizeDatabaseConnection(): void {
    mongoose.connect(this.mongoUrl);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`server is running on port ${this.port}`);
    });
  }
}

export default App;
