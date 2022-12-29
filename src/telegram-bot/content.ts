import * as contentful from 'contentful';

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: '61rcwdduuh3b',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: 'XCI2OoFYVWapua0Hl_6Z7v5TIYOCezLHtMEnSrkp-S0',
});

const getShortStayVisaWithSponsorShipContent = async () => {
  try {
    const res = await client.getEntry('2cRXt8MglNM5vk95hldRT2');
    console.log(res.fields);
    return res.fields;
  } catch (e) {
    console.log(e);
  }
};

export { getShortStayVisaWithSponsorShipContent };
