import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { NavItem } from "./NavItem";
import type { NavItemConfig } from "./types";

export interface NavTreeProps {
  "data-event"?: string;
  /**
   * Items to render
   */
  items: NavItemConfig[];
  variant?: "sm" | "md";
}

export const NavTree: FunctionComponent<NavTreeProps> = ({
  "data-event": dataEvent,
  items,
  variant,
}) => {
  return (
    <Flex direction="column" maxWidth="100%">
      {items.map((item, idx) => {
        return (
          <NavItem
            {...item}
            data-event={dataEvent}
            key={idx}
            level={0}
            onOpen={undefined}
            variant={variant}
          />
        );
      })}
    </Flex>
  );
};
