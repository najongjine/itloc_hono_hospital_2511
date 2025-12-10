import { Hono } from "hono";

const router = new Hono();

interface ResultType {
  success?: boolean;
  data?: any;
  msg?: string;
}
router.get("/", (c) => {
  let result: ResultType = { success: true };
  try {
    result.data = "저는 병원 서버에요";
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
