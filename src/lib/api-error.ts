export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

function fallbackMessage(status: number) {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 413) return "File is too large.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "Server error. Please try again.";
  return `Request failed with status ${status}`;
}

export function getApiErrorMessage(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    if ("message" in data && typeof data.message === "string" && data.message) {
      return data.message;
    }
    if ("errors" in data && Array.isArray(data.errors)) {
      const first = data.errors[0] as { message?: unknown } | undefined;
      if (typeof first?.message === "string") return first.message;
    }
    if ("error" in data && typeof data.error === "object" && data.error !== null) {
      const error = data.error as { message?: unknown; issues?: { message?: unknown }[] };
      const issue = error.issues?.[0]?.message;
      if (typeof issue === "string") return issue;
      if (typeof error.message === "string" && !error.message.startsWith("[")) {
        return error.message;
      }
    }
  }
  return fallbackMessage(status);
}

type ResponseLike = { status: number; text(): Promise<string> };

export async function toApiError(res: ResponseLike): Promise<ApiError> {
  let data: unknown = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return new ApiError(getApiErrorMessage(data, res.status), res.status);
}
