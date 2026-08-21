export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';
export {
  Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount,
} from './components/Avatar';
export { Button, buttonVariants } from './components/Button';
export { Badge, badgeVariants } from './components/Badge';
export {
  Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent,
} from './components/Card';
export {
  Skeleton, SkeletonKpiCard, SkeletonTableRow, SkeletonTable, SkeletonPage, Loading, TabLoading,
} from './components/Skeleton';
export { BrandLoading } from './components/BrandLoading';
export { KpiCard, KpiGrid } from './components/KpiCard';
export type { KpiCardProps } from './components/KpiCard';
export {
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption,
} from './components/Table';
export { toast, useToast, Toaster } from './components/Toast';
export type { ToastOptions } from './components/Toast';
export { StatusDot } from './components/StatusDot';
export type { StatusDotProps } from './components/StatusDot';
export { StatusBadge, DeviceStatusBadge, deviceStatusMeta } from './components/StatusBadge';
export type { StatusBadgeProps, StatusVariant, DeviceStatus, DeviceStatusBadgeProps } from './components/StatusBadge';
export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';
export {
  DateRangePicker, PRESETS, computePreset, comparisonRange, defaultRange,
} from './components/DateRangePicker';
export type { DateRangePickerProps, RangeValue, Compare } from './components/DateRangePicker';
export { AppRail } from './components/AppRail';
export type { AppRailProps, RailItem } from './components/AppRail';
export { AppSecondarySidebar, AppSubNav } from './components/AppSecondarySidebar';
export type {
  AppSecondarySidebarProps, AppSubNavProps, SidebarNavItem, SidebarSection,
} from './components/AppSecondarySidebar';
export { ContentHeader } from './components/ContentHeader';
export type { ContentHeaderProps } from './components/ContentHeader';
export { AppFooter } from './components/AppFooter';
export { PageFrame } from './components/PageFrame';
export type { PageFrameProps } from './components/PageFrame';
export { AppBottomNav } from './components/AppBottomNav';
export type { AppBottomNavProps, BottomNavItem } from './components/AppBottomNav';
export { AppMobileHeader } from './components/AppMobileHeader';
export type { AppMobileHeaderProps } from './components/AppMobileHeader';
export { UserMenu } from './components/UserMenu';
export type { UserMenuProps, UserMenuItem } from './components/UserMenu';
export {
  AppUserMenu, USER_MENU_PROFILE_LABEL, USER_MENU_SETTINGS_LABEL,
} from './components/AppUserMenu';
export type { AppUserMenuProps } from './components/AppUserMenu';
export { EmptyState, SearchEmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { DateTimeField } from './components/DateTimeField';
export type { DateTimeFieldProps } from './components/DateTimeField';
export { Label } from './components/Label';
export { Separator } from './components/Separator';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/Tooltip';
export {
  DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent,
} from './components/DropdownMenu';
export {
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem,
  SelectSeparator, SelectScrollUpButton, SelectScrollDownButton,
} from './components/Select';
export { NativeSelect } from './components/NativeSelect';
export type { NativeSelectProps } from './components/NativeSelect';
export { ConfirmDialog } from './components/ConfirmDialog';
export type { ConfirmDialogProps } from './components/ConfirmDialog';
export {
  AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel,
} from './components/AlertDialog';
export { cn } from './lib/cn';
// Camada de boot (JET-118): os valores que a app precisa ANTES de existir CSS var
// — o build injeta o `meta theme-color` e o splash do index.html a partir daqui,
// em vez de repetir o hex da marca em cada index.html.
export {
  BOOT_COLORS, BOOT_LOGO_PATH, BOOT_THEME_STORAGE_KEY, BOOT_THEME_DARK_VALUE,
} from './themes/boot';
export { SectionCard } from './components/SectionCard';
export type { SectionCardProps } from './components/SectionCard';
export { SegmentedTabs } from './components/SegmentedTabs';
export type { SegmentedTabItem, SegmentedTabsProps } from './components/SegmentedTabs';
export { DetailHeader } from './components/DetailHeader';
export type { DetailHeaderProps } from './components/DetailHeader';
export { AppGlobalSearch } from './components/AppGlobalSearch';
export type {
  AppGlobalSearchProps, AppGlobalSearchLabels, SearchFilterOption, SearchResultItem,
} from './components/AppGlobalSearch';
