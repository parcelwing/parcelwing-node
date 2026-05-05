export function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function toQueryString(params: Record<string, unknown>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (typeof value === "boolean") {
      search.set(key, value ? "true" : "false");
      continue;
    }

    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}
