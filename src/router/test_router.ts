import { Hono } from "hono";

const router = new Hono();

interface ResultType {
  success?: boolean;
  data?: any;
  msg?: string;
}
router.get("/query_string", async (c) => {
  let result: ResultType = { success: true };
  try {
    let query = String(c?.req?.query("query") ?? "데이터 안보냄");

    query = query?.trim() ?? "";
    result.data = `클라이언트가 보낸 q 라는 데이터: ${query}`;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.get("/query_string_array", async (c) => {
  let result: ResultType = { success: true };
  try {
    const tags = c.req.queries("tags");

    result.data = tags;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

router.get("/header", async (c) => {
  let result: ResultType = { success: true };
  try {
    const custom_header = c.req.header("custom_header");

    result.data = custom_header;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

/** 큰 데이터 받는 방법. 이거를 제일 많이 씀 */
router.post("/formdata_body", async (c) => {
  let result: ResultType = { success: true };
  try {
    const body = await c.req.parseBody({ all: true });

    const files = body["files[]"];
    const strdata1 = body["strdata1"];
    result.data = { files: files, strdata1: strdata1 };
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
