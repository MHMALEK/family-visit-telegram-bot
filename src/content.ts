import * as contentful from 'contentful';
import * as dotEnv from 'dotenv';

dotEnv.config();

class ContentService {
  client: any;
  constructor() {
    this.client = contentful.createClient({
      space: process.env.FAMILY_VISIT_CONTENT_API_SPACE_ID,
      accessToken: process.env.FAMILY_VISIT_CONTENT_API_TOKEN,
    });
  }

  getShortStayVisaWithSponsorShipContent = async () => {
    try {
      const res = await this.client.getEntry('2cRXt8MglNM5vk95hldRT2');
      return res.fields;
    } catch (e) {
      console.log(e);
    }
  };
}

export default ContentService;
