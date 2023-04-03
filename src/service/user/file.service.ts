import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'src/helpers/Error';

interface GetFileResponse {
  data: ArrayBuffer;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly httpService: HttpService) {}

  async getFile(file_url: string): Promise<GetFileResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get(file_url, { responseType: 'arraybuffer' }).pipe(
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
    return { data };
  }
}
