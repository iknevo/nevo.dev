import { AppTypes } from "@/src/app/api/[[...routes]]/route";
import { hc } from "hono/client";

export const client = hc<AppTypes>(process.env.NEXT_PUBLIC_APP_URL!);
