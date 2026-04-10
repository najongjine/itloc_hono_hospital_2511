import { Hono } from "hono";
const router = new Hono();
router.get("/", async (c) => {
    let result = { success: true };
    try {
        const kakao_restapi_key = process.env.KAKAO_RESTAPI_KEY;
        let query = String(c?.req?.query("query") ?? "병원");
        query = query?.trim() ?? "";
        let x = String(c?.req?.query("x") ?? "0");
        x = x?.trim() ?? "";
        let y = String(c?.req?.query("y") ?? "0");
        y = y?.trim() ?? "";
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("x", x);
        params.append("y", y);
        params.append("category_group_code", "HP8");
        params.append("radius", "2000");
        params.append("sort", "distance");
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword?${params}`, {
            method: "GET",
            headers: {
                Authorization: `KakaoAK ${kakao_restapi_key}`,
            },
        });
        const responseJson = await response.json();
        result.data = responseJson?.documents ?? [];
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.msg = `!server error. ${error?.message ?? ""}`;
        return c.json(result);
    }
});
export default router;
