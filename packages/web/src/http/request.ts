export type JsonRequestOptions = RequestInit & {
  baseUrl: string;
};

export async function jsonRequest<TResponse>(
  path: string,
  { baseUrl, headers, ...init }: JsonRequestOptions,
): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export type MultipartRequestOptions = {
  baseUrl: string;
  body: FormData;
  headers?: HeadersInit;
  method?: "POST" | "PUT" | "PATCH";
};

export async function multipartRequest<TResponse>(
  path: string,
  { baseUrl, body, headers, method = "POST" }: MultipartRequestOptions,
): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    body,
    headers,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? "Request failed");
  }

  return response.json() as Promise<TResponse>;
}
