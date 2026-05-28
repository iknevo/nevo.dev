import { hc } from "hono/client";

import type { AppTypes } from "@/src/app/api/[[...routes]]/route";

const client = hc<AppTypes>("");
export const api = client.api;
