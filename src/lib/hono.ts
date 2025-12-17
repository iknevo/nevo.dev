import { hc } from "hono/client";

import type { AppTypes } from "@/src/app/api/[[...routes]]/route";

const client = hc<AppTypes>(process.env.NEXT_PUBLIC_APP_URL!);
export const api = client.api;
