import { body } from "express-validator";

export const songValidationRules = [
  body("title").notEmpty().withMessage("Title is required").isString(),
  body("artist").notEmpty().withMessage("Artist is required").isString(),
  body("album").notEmpty().withMessage("Album is required").isString(),
  body("genre").notEmpty().withMessage("Genre is required").isString(),
  body("playCount")
    .optional()
    .isNumeric()
    .withMessage("Play count must be a number"),
];
