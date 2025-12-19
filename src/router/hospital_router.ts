import { Hono } from "hono";
import { HonoEnv } from "../types/types.js";

const router = new Hono<HonoEnv>();

interface ResultType {
  success?: boolean;
  data?: any;
  msg?: string;
}
router.get("/", async (c) => {
  let result: ResultType = { success: true };
  try {
    const db = c.var.db;
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

    let _data: any = await response.json();
    _data = _data?.documents ?? [];
    const ids: string[] = _data.map((item: any) => item.id);

    let _data2: any = await db.query(
      "SELECT * FROM hospitals WHERE id = ANY($1)",
      [ids] // 배열 전체를 하나의 파라미터($1)로 전달
    );
    _data2 = _data2?.rows ?? [];

    const hospitalMap: any = new Map(
      _data2.map((item: any) => [item.id, item])
    );

    // 2. _data를 순회하며 데이터 병합 및 가공
    _data = _data.map((item: any) => {
      // 매칭되는 DB 데이터 찾기
      const dbItem: any = hospitalMap.get(item?.id);

      return {
        ...item, // 기존 _data의 필드 유지

        // 요청 1: distance 복사해서 distance_m 만들기
        distance_m: item.distance,

        // 요청 2: 매칭 데이터가 있으면 그 값을, 없으면 기본값(3, 2) 사용
        rating: dbItem ? dbItem?.rating : 3,
        congestion_level: dbItem ? dbItem.congestion_level : 2,
      };
    });
    result.data = _data2;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.msg = `!server error. ${error?.message ?? ""}`;
    return c.json(result);
  }
});

export default router;
