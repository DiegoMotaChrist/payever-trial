import { Injectable } from '@nestjs/common';
import { FileService } from 'src/service/user/file.service';

interface GetFileCaseRequest {
  fileUrl: string;
}
interface GetFileCaseResponse {
  buffer: Buffer;
  base64: string;
}

@Injectable()
export class GetFileCase {
  constructor(private readonly fileService: FileService) {}

  async execute(request: GetFileCaseRequest): Promise<GetFileCaseResponse> {
    const { fileUrl } = request;

    const { data } = await this.fileService.getFile(fileUrl);

    const buffer = Buffer.from(data);
    const base64 = buffer.toString('base64');

    return { buffer, base64 };
  }
}
