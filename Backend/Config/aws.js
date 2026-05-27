const { LambdaClient } = require("@aws-sdk/client-lambda");

const { SSMClient } = require("@aws-sdk/client-ssm");

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,

    secretAccessKey: process.env.AWS_SECRET,
  },
});

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,

    secretAccessKey: process.env.AWS_SECRET,
  },
});

module.exports = {
  lambdaClient,

  ssmClient,
};
