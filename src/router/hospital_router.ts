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

    const params = new URLSearchParams();
    params.append("query", "맛집");
    params.append("x", "");
    params.append("y", "");

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
    result.data = _data;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
