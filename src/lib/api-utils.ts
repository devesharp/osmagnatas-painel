import { boolean } from "zod";

export interface SortData {
  direction: "asc" | "desc";
  column: string;
}

export interface SearchRequestData {
  sort?: SortData;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

export function convertDataToSearchRequest(data: SearchRequestData) {
  const { sort, limit, offset, ...filters } = data;

  return {
    query: {
      sort: sort?.column
        ? sort?.direction === "asc"
          ? sort.column
          : `-${sort.column}`
        : undefined,
      limit: limit || 20,
      offset: offset || 0,
    },
    filters,
  };
}

// Converta o JSON em FormData manualmente
export function convertToFormData<T = Record<string, unknown>>(
  obj: T,
  form?: FormData,
  parentKey = ""
): FormData {
  const formData = form || new FormData();

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

    if (
      typeof value === "object" &&
      !(value instanceof Buffer || value instanceof File)
    ) {
      convertToFormData(value, formData, fieldKey);
    } else {
      if (value === true || value === false) {
        formData.append(fieldKey, value ? "1" : "0");
      } else {
        formData.append(fieldKey, value as string | Blob);
      }
    }
  }

  return formData;
}
