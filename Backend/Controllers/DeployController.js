const Deployment = require("../models/Deployment");
const deploymentQueue = require("../queue/deploymentQueue");

exports.deploy = async (req, res) => {
  try {
    const { clientName, domain, image } = req.body;

    if (!clientName || !domain || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const deployment = await Deployment.create({
      clientName,
      domain,
      image,
      status: "Pending",
    });

    await deploymentQueue.add("deployJob", {
      deploymentId: deployment._id,
    });

    return res.status(200).json({
      success: true,
      message: "Deployment Started",
      deploymentId: deployment._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);

    if (!deployment) {
      return res.status(404).json({
        success: false,
        message: "Deployment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deployment found Successfully",
      deployment,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting Deployment",
    });
  }
};
