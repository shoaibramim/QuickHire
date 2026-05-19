import { Router } from "express";
import { body, validationResult } from "express-validator";
import https from "https";

const router = Router();
const FORMSUBMIT_URL = "https://formsubmit.co/shoaibu.ramim@gmail.com";

function postToFormSubmit(payload: URLSearchParams) {
  return new Promise<{ statusCode: number; body: string }>(
    (resolve, reject) => {
      const data = payload.toString();
      const request = https.request(
        FORMSUBMIT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(data),
            Accept: "application/json",
          },
        },
        (response) => {
          let body = "";
          response.on("data", (chunk) => {
            body += chunk;
          });
          response.on("end", () => {
            resolve({ statusCode: response.statusCode ?? 500, body });
          });
        },
      );

      request.on("error", reject);
      request.setTimeout(10000, () => {
        request.destroy(new Error("FormSubmit request timed out."));
      });

      request.write(data);
      request.end();
    },
  );
}

router.post(
  "/",
  body("name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("subject").optional().isString(),
  body("message").trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body as {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };

    const payload = new URLSearchParams();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("subject", subject ?? "");
    payload.append("message", message);
    payload.append(
      "_subject",
      `QuickHire Contact: ${subject ? subject : "New message"}`,
    );
    payload.append("_captcha", "false");
    payload.append("_template", "table");
    payload.append("_replyto", email);

    try {
      const response = await postToFormSubmit(payload);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return res.json({ success: true });
      }
      return res.status(502).json({
        message: "FormSubmit failed to accept the message.",
        statusCode: response.statusCode,
      });
    } catch (error) {
      return res.status(502).json({
        message: "Unable to reach FormSubmit.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

export default router;
