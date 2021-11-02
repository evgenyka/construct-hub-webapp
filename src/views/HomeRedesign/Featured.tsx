import { Flex, Grid, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { DEFAULT_FEATURED_PACKAGES } from "../../api/config";
import { PackageCard } from "../../components/PackageCard";
import { useConfigValue } from "../../hooks/useConfigValue";
import { SECTION_PADDING } from "./constants";
import testIds from "./testIds";
import { useSection } from "./useSection";

export const Featured: FunctionComponent = () => {
  const homePackages = useConfigValue("featuredPackages");
  const [featured = { name: "Recently Updated", showLastUpdated: 4 }] = (
    homePackages ?? DEFAULT_FEATURED_PACKAGES
  ).sections;

  const section = useSection(featured);

  if (!section) {
    return null;
  }

  return (
    <Flex
      data-testid={testIds.featuredContainer}
      direction="column"
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
      zIndex="0"
    >
      <Heading
        as="h3"
        color="white"
        data-testid={testIds.featuredHeader}
        fontSize="1.5rem"
        fontWeight="semibold"
        lineHeight="lg"
      >
        {featured.name}
      </Heading>
      <Grid
        data-testid={testIds.featuredGrid}
        gap={4}
        mt={8}
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      >
        {section?.slice(0, 4).map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} />
        ))}
      </Grid>
    </Flex>
  );
};
