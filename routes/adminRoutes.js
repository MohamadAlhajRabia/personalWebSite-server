const express = require("express");
const moment = require("moment");

const router = express.Router();

const messagesController = require("../controllers/messagesController");
const MESSAGECONTROLLER = new messagesController();

const personalInformationsController = require("../controllers/PersonalInformationController");
const PERSONALINFORMATIONSCONROLLER = new personalInformationsController();

const textController = require("../controllers/textsController");
const TEXTCONTROLLER = new textController();

const ProfileImageController = require("../controllers/profileImageController");
const PROFILEIMAGECONTROLLER = new ProfileImageController();

const uploadSocialMedia = require("../middlewares/uploadMiddlewareSoialMedia");
const SocialMediaImagesController = require("../controllers/socialMediaImagesController");
const SOCIALMEDIA = new SocialMediaImagesController();

const upload = require("../middlewares/uploadMiddleware");
const socialMediaImages = require("../dataBases/schemas/socialMediaSchema");

const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET ALL MESSAGES API ==#
router.get("/contact", async (req, res) => {
  try {
    const data = await MESSAGECONTROLLER.getAllMessages();

    if (data.error) {
      return res.status(500).send(data);
    }
    if (data.length === 0) {
      return res.status(204).send(); // No content
    }

    const formattedData = data.map((message) => ({
      ...message.toObject(), // تحويل الرسالة إلى كائن JavaScript عادي
      createdDate: moment(message.createdDate).format("YYYY-MM-DD HH:mm"),
    }));

    res.status(200).send(formattedData);
  } catch (err) {
    console.error("Error handling GET /contact request:", err);
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START DELETE MESSAGE BY ID ==#
router.delete("/contact/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await MESSAGECONTROLLER.deleteMessage(id);

    if (data.error) {
      return res.status(404).send(data);
    }

    res.status(200).send(data);
  } catch (err) {
    console.error("Error handling DELETE /contact/:id request:", err);
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START GET MESSAGE BY ID ==#
router.get("/contact/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await MESSAGECONTROLLER.getMessageById(id);

    if (data.error) {
      return res.status(404).send(data);
    }

    res.status(200).send(data);
  } catch (err) {
    console.error("Error handling GET /contact/:id request:", err);
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START POST PERSONAL INFORMATIONS API ==#
router.post("/personalinformations", async (req, res) => {
  const { name, email, number } = req.body;

  if (!name || !email || !number) {
    return res.status(400).send({
      message: "All fields are required: name, email, and number",
    });
  }

  if (!emailValidator(email)) {
    return res.status(400).send({ error: "Invalid email format." });
  }

  try {
    const data = await PERSONALINFORMATIONSCONROLLER.postPersonalInformation(
      req.body
    );
    res.status(201).send(data);
  } catch (err) {
    console.error("Error handling POST /personalinformations request:", err);
    res.status(500).send({ error: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START DELETE PERSONAL INFORMATIONS API ==#
router.delete("/personalinformations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await PERSONALINFORMATIONSCONROLLER.deletePersonalInformations(
      id
    );

    if (data.error) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error(
      "Error handling DELETE /personalinformations/:id request:",
      err
    );
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START UPDATE PERSONAL INFORMATIONS API ==#
router.put("/personalinformations/:id", async (req, res) => {
  const { name, email, number } = req.body;
  const { id } = req.params;

  if (!name || !email || !number) {
    return res.status(400).send({
      message: "All fields are required: name, email, and number",
    });
  }

  if (!emailValidator(email)) {
    return res.status(400).send({ error: "Invalid email format." });
  }

  try {
    const data = await PERSONALINFORMATIONSCONROLLER.updatePersonalInformations(
      {
        _id: id,
        name,
        email,
        number,
      }
    );

    if (data.error) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error("Error handling PUT /personalinformations/:id request:", err);
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START POST TEXTS API ==#
router.post("/texts", async (req, res) => {
  const body = req.body;

  if (!body.about && !body.moreDetails) {
    return res.status(400).send({
      error:
        'At least one of the fields "about" or "moreDetails" must be provided.',
    });
  }

  try {
    const data = await TEXTCONTROLLER.addTexts(body);
    return res.status(201).send(data);
  } catch (err) {
    console.error("Error handling POST /texts request:", err);
    res.status(500).send({ error: "Internal Server Error: " + err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START UPDATE TEXTS API ==#
router.put("/texts/:id", async (req, res) => {
  const { about, moreDetails } = req.body;
  const { id } = req.params;

  if (!about && !moreDetails) {
    return res.status(400).send({
      error:
        'At least one of the fields "about" or "moreDetails" must be provided.',
    });
  }

  try {
    const data = await TEXTCONTROLLER.updateTexts(id, { about, moreDetails });

    if (data.error) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error("Error handling PUT /texts/:id request:", err);
    return res.status(500).send({
      error: "Internal Server Error: " + err.message,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START DELETE TEXTS API ==#
router.delete("/texts/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      error: "ID is required.",
    });
  }

  try {
    const data = await TEXTCONTROLLER.deleteText(id);

    if (data.error) {
      return res.status(404).send(data);
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error("Error handling DELETE /texts/:id request:", err);
    return res.status(500).send({
      error: "Internal Server Error: " + err.message,
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START POST PROFILE IMAGE API ==#
router.post(
  "/profileImage",
  upload.single("profileImage"),
  PROFILEIMAGECONTROLLER.uploadImage
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START DELETE PROFILE IMAGE API ==#
router.delete(
  "/profileImage/:id",
  PROFILEIMAGECONTROLLER.deleteProfileImage.bind(PROFILEIMAGECONTROLLER)
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START UPDATE PROFILE IMAGE API ==#
router.put(
  "/profileImage/:id",
  upload.single("profileImage"),
  PROFILEIMAGECONTROLLER.updateProfileImage
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START POST PROFILE IMAGE API ==#
router.post(
  "/socialMedia",
  uploadSocialMedia.single("socialMedia"),
  SOCIALMEDIA.addSocialMediaImage
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #== START DELETE Social Media IMAGE API ==#
router.delete(
  "/socialMedia/:id",
  SOCIALMEDIA.deleteSocialMediaImage.bind(SOCIALMEDIA)
);

router.put(
  '/socialMedia/:id',
  uploadSocialMedia.single('socialMedia'),
  SOCIALMEDIA.updateSocialMediaImage
)

module.exports = router;
