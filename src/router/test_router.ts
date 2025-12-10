import { Hono } from "hono";

const router = new Hono();

interface ResultType {
  success?: boolean;
  data?: any;
  msg?: string;
}
router.get("/", async (c) => {
  let result: ResultType = { success: true };
  try {
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
