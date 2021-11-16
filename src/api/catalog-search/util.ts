import { compare } from "semver";
import { CatalogSearchFilters, ExtendedCatalogPackage } from ".";
import { Language } from "../../constants/languages";
import { CatalogSearchSort } from "./constants";

export type SortFunction = (
  p1: ExtendedCatalogPackage,
  p2: ExtendedCatalogPackage
) => number;

type FilterFunctionBuilder<T> = (
  filter: T
) => undefined | ((pkg: ExtendedCatalogPackage) => boolean);

const getVersionSort =
  (isAscending: boolean): SortFunction =>
  (p1, p2) =>
    compare(p1.version, p2.version) * (isAscending ? 1 : -1);

const getStrSort = (isAscending: boolean): SortFunction => {
  return (p1, p2) => {
    if (p1.name === p2.name) {
      // Sort by versions if the names are identical.
      return getVersionSort(isAscending)(p1, p2);
    }
    return p1.name.localeCompare(p2.name) * (isAscending ? 1 : -1);
  };
};

const getDateSort =
  (isAscending: boolean): SortFunction =>
  (p1, p2) => {
    // Sorting only by the DATE portion of the timestamp. ISOString is YYYY-MM-DD'T'HH:mm:ss.SSSZ
    const d1 = new Date(p1.metadata.date).toISOString().split("T")[0];
    const d2 = new Date(p2.metadata.date).toISOString().split("T")[0];

    // If they're equal, fall back to alphanumerical ordering.
    if (d1 === d2) {
      return getStrSort(!isAscending)(p1, p2);
    }

    if (isAscending) {
      return d2 < d1 ? 1 : -1;
    }

    return d1 < d2 ? 1 : -1;
  };

const getDownloadsSort = (isAscending: boolean): SortFunction => {
  return (p1, p2) => {
    if (p1.downloads !== p2.downloads) {
      return (p1.downloads - p2.downloads) * (isAscending ? 1 : -1);
    } else {
      // break ties by alphabetical
      return getStrSort(!isAscending)(p1, p2);
    }
  };
};

const getLanguagesFilter: FilterFunctionBuilder<
  CatalogSearchFilters["languages"]
> = (languages) => {
  const languageSet =
    (languages?.length ?? 0) > 0 ? new Set(languages) : undefined;

  if (!languageSet || languageSet.has(Language.TypeScript)) {
    return undefined;
  }

  return (pkg) => {
    const isMatched = Object.keys(pkg.languages ?? {}).some((lang) =>
      languageSet.has(lang as Language)
    );

    return isMatched;
  };
};

const getCDKTypeFilter: FilterFunctionBuilder<CatalogSearchFilters["cdkType"]> =
  (cdkType) => {
    if (!cdkType) return undefined;
    return (pkg) => pkg.metadata?.constructFramework?.name === cdkType;
  };

const getCDKMajorFilter: FilterFunctionBuilder<
  CatalogSearchFilters["cdkMajor"]
> = (cdkMajor) => {
  if (typeof cdkMajor !== "number") return undefined;
  return (pkg) => pkg.metadata?.constructFramework?.majorVersion === cdkMajor;
};

const getKeywordsFilter: FilterFunctionBuilder<
  CatalogSearchFilters["keywords"]
> = (keywords) => {
  if (!keywords?.length) return undefined;

  return (pkg) =>
    (pkg?.keywords ?? []).some((keyword) => keywords.includes(keyword));
};

const getTagsFilter: FilterFunctionBuilder<CatalogSearchFilters["tags"]> = (
  tags
) => {
  if (!tags || !tags.length) {
    return undefined;
  }

  return (pkg) => {
    return (
      pkg.metadata?.packageTags?.some((tag) => {
        return tags.includes(tag.id);
      }) ?? false
    );
  };
};

export const SORT_FUNCTIONS: Record<CatalogSearchSort, SortFunction> = {
  [CatalogSearchSort.NameAsc]: getStrSort(true),
  [CatalogSearchSort.NameDesc]: getStrSort(false),
  [CatalogSearchSort.PublishDateAsc]: getDateSort(true),
  [CatalogSearchSort.PublishDateDesc]: getDateSort(false),
  [CatalogSearchSort.DownloadsAsc]: getDownloadsSort(true),
  [CatalogSearchSort.DownloadsDesc]: getDownloadsSort(false),
};

export const FILTER_FUNCTIONS: {
  [key in keyof Required<CatalogSearchFilters>]: FilterFunctionBuilder<
    CatalogSearchFilters[key]
  >;
} = {
  cdkType: getCDKTypeFilter,
  cdkMajor: getCDKMajorFilter,
  keywords: getKeywordsFilter,
  languages: getLanguagesFilter,
  tags: getTagsFilter,
};
