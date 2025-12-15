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
    const kakao_restapi_key = process.env.KAKAO_RESTAPI_KEY;

    let query = String(c?.req?.query("query") ?? "병원");
    query = query?.trim() ?? "";
    let x = String(c?.req?.query("x") ?? "0");
    query = query?.trim() ?? "";
    let y = String(c?.req?.query("y") ?? "0");
    query = query?.trim() ?? "";

    const params = new URLSearchParams();
    params.append("query", query); // 사용자 검색어
    params.append("x", x); // longitute
    params.append("y", y); // langitute

    params.append("category_group_code", "HP8");
    params.append("radius", "2000");
    params.append("sort", "distance");
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${kakao_restapi_key}`,
        },
      }
    );

    let _data = await response.json();
    console.log(`_data: `, _data);
    result.data = _data?.documents ?? [];
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
