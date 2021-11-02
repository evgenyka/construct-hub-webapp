import {
  UnorderedList,
  ListProps,
  forwardRef,
  Divider,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useDebounce } from "../../hooks/useDebounce";
import { getPackagePath } from "../../util/url";
import { Card, CardProps } from "../Card";
import { CDKTypeIcon } from "../CDKType";
import { SearchItem } from "../SearchItem";
import { useSearchBarState } from "./SearchBar";
import testIds from "./testIds";

/**
 * A suggestion component which can be used to extend the `<SearchBar />` behavior with a list of
 * recommended results
 * ```tsx
 * import { SearchBar, SearchSuggestions } from "components/SearchBar";
 *
 * <SearchBar>
 *   <SearchSuggestions />
 * </SearchBar>
 * ```
 */
export const SearchSuggestions: FunctionComponent = forwardRef<
  CardProps & ListProps,
  "ul"
>((props, ref) => {
  const { query, isOpen } = useSearchBarState();
  const debouncedQuery = useDebounce(query);

  const { push } = useHistory();

  const { page: recommendations } = useCatalogResults({
    limit: 5,
    offset: 0,
    query: debouncedQuery,
  });

  if (!isOpen || recommendations.length < 1 || !debouncedQuery) {
    return null;
  }

  return (
    <Card
      as={UnorderedList}
      data-testid={testIds.suggestionsList}
      left={0}
      ml={0}
      pos="absolute"
      pt={10}
      px={0}
      ref={ref}
      right={0}
      top={0}
      zIndex={2}
      {...props}
    >
      {recommendations.map((pkg: ExtendedCatalogPackage, i) => {
        const navigate = () => push(getPackagePath(pkg));
        const constructFramework = pkg.metadata?.constructFramework ?? {};
        const hasIcon = Boolean(constructFramework.name);

        return (
          <>
            {i > 0 && <Divider mx={4} w="auto" />}
            <SearchItem
              data-testid={testIds.suggestion}
              key={pkg.id}
              name={
                <Stack align="center" direction="row" spacing={4}>
                  <CDKTypeIcon {...constructFramework} />
                  <Text ml={hasIcon ? 0 : 9}>{pkg.name}</Text>
                </Stack>
              }
              onClick={navigate}
              py={2}
              textAlign="left"
            />
          </>
        );
      })}
    </Card>
  );
});
