import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { config } from 'dotenv';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'src/helpers/Error';

config();

interface CreateApiUserResponse {
  id: string;
  job: string;
  name: string;
  createdAt: Date;
}

interface FindByApiUserIdResponse {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly httpService: HttpService) {}

  async createApiUser(
    job: string,
    name: string,
  ): Promise<CreateApiUserResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<CreateApiUserResponse>(
          `${process.env.GLOBAL_REQUEST_APP_URL}/users`,
          {
            job,
            name,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            const errorReponse: ErrorResponse = {
              name: error.name,
              code: error.code,
              message: error.message,
              statusText: error.response?.statusText,
            };
            throw new HttpException(
              errorReponse,
              error.response?.status ?? HttpStatus.BAD_REQUEST,
            );
          }),
        ),
    );
    return data;
  }

  async findByApiUserId(id: string): Promise<FindByApiUserIdResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<FindByApiUserIdResponse>(
          `${process.env.GLOBAL_REQUEST_APP_URL}/users/${id}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            const errorReponse: ErrorResponse = {
              name: error.name,
              code: error.code,
              message: error.message,
              statusText: error.response?.statusText,
            };
            throw new HttpException(
              errorReponse,
              error.response?.status ?? HttpStatus.BAD_REQUEST,
            );
          }),
        ),
    );
    return data;
  }

  deleteApiUser(userId: string) {
    this.httpService
      .delete(`${process.env.GLOBAL_REQUEST_APP_URL}/users/${userId}`)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          const errorReponse: ErrorResponse = {
            name: error.name,
            code: error.code,
            message: error.message,
            statusText: error.response?.statusText,
          };
          throw new HttpException(
            errorReponse,
            error.response?.status ?? HttpStatus.BAD_REQUEST,
          );
        }),
      );
  }
}
