import { Language } from "../constants/languages";
import { ROUTES, QUERY_PARAMS } from "../constants/url";

const gitSSHRegex = new RegExp(
  /git@github\.com:([a-zA-Z-]+)+\/?([a-zA-Z-]+)*(\.git)?/
);

export const getRepoUrlAndHost = (
  repoUrl: string
): { url: string; hostname: string } | undefined => {
  try {
    let url = repoUrl;

    const sshUrl = repoUrl.match(gitSSHRegex);

    if (sshUrl) {
      const [, author, repo] = sshUrl;

      url = `https://github.com/${author}/${repo}`;
    }

    return {
      hostname: new URL(url).hostname,
      url,
    };
  } catch {
    // Invalid URL, return undefined as a signal that we should not display it
    return undefined;
  }
};

export type SearchParamsObject = Record<
  string,
  string | number | undefined | null
>;

export const createURLSearchParams = (
  params: SearchParamsObject,
  base?: string
) => {
  const searchParams = new URLSearchParams(base);

  Object.entries(params)
    .filter(([, v]) => v != null)
    .forEach(([k, v]) => {
      searchParams.set(k, `${v}`);
    });

  return searchParams.toString();
};

export const createURL = (base: string, params?: SearchParamsObject) => {
  let url = base;

  if (params) {
    const search = createURLSearchParams(params);

    if (search) {
      url += `?${search}`;
    }
  }

  return url;
};

export const getSearchPath = ({
  query,
  offset,
  language,
}: {
  query?: string;
  offset?: string | number;
  language?: Language | null;
}) =>
  createURL(ROUTES.SEARCH, {
    [QUERY_PARAMS.SEARCH_QUERY]: query,
    [QUERY_PARAMS.LANGUAGE]: language,
    [QUERY_PARAMS.OFFSET]: offset ?? 0,
  });

export const getPackagePath = ({
  name,
  version,
  language,
  submodule,
}: {
  name: string;
  version: string;
  language?: Language;
  submodule?: string;
}) =>
  createURL(`${ROUTES.PACKAGES}/${name}/v/${version}`, {
    [QUERY_PARAMS.SUBMODULE]: submodule,
    [QUERY_PARAMS.LANGUAGE]: language,
  });
