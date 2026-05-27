const { Worker } = require("bullmq");
const connection = require("../config/redis");
const Deployment = require("../models/Deployment");
const DB = require("../Config/DB");
require("dotenv").config();

const { InvokeCommand } = require("@aws-sdk/client-lambda");
const { SendCommandCommand } = require("@aws-sdk/client-ssm");

const { lambdaClient, ssmClient } = require("../config/aws");

// const worker = new Worker(
//   "deploymentQueue",
//   async (job) => {
//     const { deploymentId } = job.data;

//     try {
//       const deployment = await Deployment.findById(deploymentId);

//       if (!deployment) {
//         throw new Error("Deployment not found");
//       }

//       console.log(`Deploying ${deployment.clientName}`);

//       /* Docker Pull */
//       const dockerCommands = [
//         `docker pull ${deployment.image}`,
//         `docker run -d --name ${deployment.clientName}-${Date.now()} ${deployment.image}`,
//       ];

//       /* AWS SSM */
//       const command = new SendCommandCommand({
//         DocumentName: "AWS-RunShellScript",
//         InstanceIds: [process.env.EC2_INSTANCE_ID],
//         Parameters: {
//           commands: dockerCommands,
//         },
//       });

//       await ssmClient.send(command);

//       console.log("Docker command sent");

//       /* Simulate wait */
//       await new Promise((resolve) => setTimeout(resolve, 10000));

//       /* Lambda Trigger */
//       const lambdaCommand = new InvokeCommand({
//         FunctionName: process.env.LAMBDA_NAME,

//         Payload: Buffer.from(
//           JSON.stringify({
//             domain: deployment.domain,

//             client: deployment.clientName,
//           }),
//         ),
//       });

//       await lambdaClient.send(lambdaCommand);
//       await Deployment.findByIdAndUpdate(deploymentId, {
//         status: "Completed",
//         logs: "Container deployed and Lambda triggered",
//       });

//       console.log("Completed");
//     } catch (err) {
//       console.log(err);
//       await Deployment.findByIdAndUpdate(deploymentId, {
//         status: "Failed",

//         logs: err.message,
//       });
//     }
//   },
//   { connection },
// );

const worker = new Worker(
  "deploymentQueue",
  async (job) => {
    const { deploymentId } = job.data;

    try {
      const deployment = await Deployment.findById(deploymentId);

      if (!deployment) {
        throw new Error("Deployment not found");
      }

      console.log(`Starting deployment for ${deployment.clientName}`);

      /* STEP 1 simulate docker pull */
      await Deployment.findByIdAndUpdate(deploymentId, {
        logs: "Pulling Docker image...",
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      /* STEP 2 simulate docker run */

      await Deployment.findByIdAndUpdate(deploymentId, {
        logs: "Running Docker container...",
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      /* STEP 3 simulate lambda */
      await Deployment.findByIdAndUpdate(deploymentId, {
        logs: "Triggering Lambda setup...",
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      /* success */
      await Deployment.findByIdAndUpdate(deploymentId, {
        status: "Completed",

        logs: "Deployment completed successfully",
      });

      console.log("Deployment completed");
    } catch (err) {
      console.log(err);
      await Deployment.findByIdAndUpdate(deploymentId, {
        status: "Failed",
        logs: err.message,
      });
    }
  },

  { connection },
);

worker.on("completed", () => {
  console.log("job complete");
});

worker.on("failed", (err) => {
  console.log(err);
});

console.log("Deployment Worker Running...");