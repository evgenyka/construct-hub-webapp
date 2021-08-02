import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
const { apiUrl } = serverRuntimeConfig;

export const API_PATHS = {
  PACKAGES_PREFIX: `${apiUrl}/data`,
  CATALOG_SUFFIX: `${apiUrl}/catalog.json`,
  ASSEMBLY_SUFFIX: `${apiUrl}/assembly.json`,
  METADATA_SUFFIX: `${apiUrl}/metadata.json`,
} as const;

export const QUERY_PARAMS = {
  LANGUAGE: "lang",
  OFFSET: "offset",
  SEARCH_QUERY: "q",
  SUBMODULE: "submodule",
} as const;

export const ROUTES = {
  FAQ: "/faq",
  HOME: "/",
  PACKAGES: "/packages",
  SEARCH: "/search",
  SITE_TERMS: "/terms",
};

type QueryParams = typeof QUERY_PARAMS;

export type QueryParamKey = QueryParams[keyof QueryParams];
