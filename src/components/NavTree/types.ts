export interface NavItemConfig {
  "data-event"?: string;
  children: NavItemConfig[];
  title: string;
  path?: string;
}
