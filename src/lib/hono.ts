import type { AppTypes } from "@/src/app/api/[[...routes]]/route";
import { hc } from "hono/client";

const client = hc<AppTypes>(process.env.NEXT_PUBLIC_APP_URL!);
export const api = client.api;
