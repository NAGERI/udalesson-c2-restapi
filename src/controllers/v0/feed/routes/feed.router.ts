import { Router, Request, Response } from "express";
import { FeedItem } from "../models/FeedItem";
import { requireAuth } from "../../users/routes/auth.router";
import * as AWS from "../../../../aws";

const router: Router = Router();

// Get all feed items
router.get("/", async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send(`Resource ${id} does't exist`);
  }

  const item = await FeedItem.findByPk(id);

  if (!item) {
    /**
     * Before last line, use return key woerd to avoid, sending header to client > 1nce
     * Error: Cannot set headers after they are sent to the client
     */
    return res.status(404).send(`Resource ${id} is malformed`);
  }
  res.status(200).json({ item });
});
// update a specific resource
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  //@TODO try it yourself
  const { id: _id } = req.params;
  const { url: new_url, caption: new_caption } = req.body;
  if (!_id) {
    return res.status(400).send(`Resource ${_id} does't exist`);
  }

  let item = await FeedItem.findByPk(_id).then((val) => {
    console.log(val);
    val.url = new_url;
  });

  // if (!item) {
  //   return res.status(404).send(`Resource ${_id} is malformed`);
  // }
  // let url = item.url;
  // let caption = item.caption;

  // const updatedItem = await FeedItem.update(
  //   { url: new_url, caption: new_caption },
  //   { where: { id: 1 } }
  // );
  res.status(204).json({ item, new_url });
});

// Get a signed url to put a new item in the bucket
router.get(
  "/signed-url/:fileName",
  requireAuth,
  async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
  }
);

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const caption = req.body.caption;
  const fileName = req.body.url;

  // check Caption is valid
  if (!caption) {
    return res
      .status(400)
      .send({ message: "Caption is required or malformed" });
  }

  // check Filename is valid
  if (!fileName) {
    return res.status(400).send({ message: "File url is required" });
  }

  const saved_item = await FeedItem.create({
    caption: caption,
    url: fileName,
  });

  /*
  FeedItem.create() -- combines build and save
  await new FeedItem({
    caption: caption,
    url: fileName,
  });
     */
  // const saved_item = await item.save();

  saved_item.url = AWS.getGetSignedUrl(saved_item.url);
  res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
