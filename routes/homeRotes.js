const express = require("express");
const router = express.Router();

const PERSONALINFORMATIONSCONROLLER = require("../controllers/PersonalInformationController");
const personalInformationsController = new PERSONALINFORMATIONSCONROLLER();

const MESSAGECONTROLLER = require("../controllers/messagesController");
const messagesController = new MESSAGECONTROLLER();

const textController = require("../controllers/textsController");
const TEXTCONTROLLER = new textController();

const ProfileImageController = require("../controllers/profileImageController");
const PROFILEIMAGECONTROLLER = new ProfileImageController();

const socialMediaController = require("../controllers/socialMediaImagesController");
const SOCIALMEDIA = new socialMediaController();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== Start post Message Api ==#
const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== Start post Message Api ==#
router.post("/contact", async (req, res) => {
  const { SenderName, senderEmail, title, messageContent } = req.body;

  if (!SenderName || !senderEmail || !title || !messageContent) {
    return res.status(400).send({
      error:
        "All fields are required: SenderName, senderEmail, title, and messageContent.",
    });
  }

  if (!emailValidator(senderEmail)) {
    return res.status(400).send({ error: "Invalid email format." });
  }

  try {
    const data = await messagesController.postMessage(req.body);
    res.status(201).send(data);
  } catch (err) {
    console.error("Error handling /home/contact request:", err);
    res.status(500).send({ error: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET PERSONAL INFORMATIONS ==#
router.get("/personalinformations", async (req, res) => {
  try {
    const data = await personalInformationsController.getPersonalInformations();
    if (data.error) {
      return res.status(500).send(data);
    }
    if (data.length === 0) {
      return res.status(204).send(); // No content
    }

    res.status(200).send(data);
  } catch (err) {
    console.error(
      "Error handling GET /home/personalinformations request:",
      err
    );
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET TEXTS ==#
router.get("/texts", async (req, res) => {
  try {
    const data = await TEXTCONTROLLER.getAllTexts();

    if (data.error) {
      return res.status(500).send(data);
    }

    if (data.length === 0) {
      return res.status(204).send(); // No content
    }

    res.status(200).send(data);
  } catch (err) {
    console.error("Error handling GET /texts request:", err); // استخدام console.error بدلاً من console.log
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET ALL PROFILE IMAGES API ==#
router.get(
  "/profileImage",
  PROFILEIMAGECONTROLLER.getProfileImages.bind(PROFILEIMAGECONTROLLER)
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET ALL SOCIAL MEDIA IMAGES API ==#
router.get(
  '/socialMedia',
  SOCIALMEDIA.getAllSocialMediaIMages.bind(SOCIALMEDIA)
)

module.exports = router;
