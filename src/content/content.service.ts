import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require('contentful');

@Injectable()
export class ContentService {
  client: any;
  constructor(private configService: ConfigService) {
    this.client = contentful.createClient({
      space: this.configService.get<string>('IND_CONTENT_API_SPACE'),
      accessToken: this.configService.get<string>('IND_CONTENT_API_TOKEN'),
    });
  }

  async fetchIndServicesList() {
    try {
      const res = await this.client.getEntry('1gfKPF7hHSl8h1quXuVLke');
      return (res.fields as any).steps;
    } catch (e) {
      console.log(e);
    }
  }
}
