import * as React from 'react';
import { ReactNode } from 'react';
import { Avatar as Avatar$1 } from '@base-ui/react/avatar';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { Button as Button$1 } from '@base-ui/react/button';
import { VariantProps } from 'class-variance-authority';
import { useRender } from '@base-ui/react/use-render';
import { LucideIcon } from 'lucide-react';
import { Separator as Separator$1 } from '@base-ui/react/separator';
import { Tooltip as Tooltip$1 } from '@base-ui/react/tooltip';
import { Menu } from '@base-ui/react/menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { ClassValue } from 'clsx';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    /** Título do cabeçalho. Ausente = sem cabeçalho (nem X). */
    title?: ReactNode;
    /** Subtítulo/descrição opcional abaixo do título. */
    description?: ReactNode;
    children: ReactNode;
    /** Rodapé (ex.: Cancelar/Aplicar). Ausente = sem rodapé. */
    footer?: ReactNode;
    /** Largura máxima do card. Régua do platform = md. */
    size?: 'sm' | 'md' | 'lg';
}
/**
 * Modal canônico do ecossistema JETOOH — extraído do padrão do platform
 * (party-add-modal): overlay `bg-preto/40` com `backdrop-blur-sm`, card
 * `rounded-2xl` com borda cinza e SEM sombra (régua flat), entrada
 * `animate-fade-in-up` (0.2s). Esc e clique no overlay fecham.
 *
 * A11y (WCAG 2.4.3/4.1.2): ao abrir, foca o primeiro elemento e PRENDE o foco
 * (Tab/Shift+Tab ciclam dentro); ao fechar, devolve o foco ao gatilho; título
 * ligado via `aria-labelledby`. Fonte ÚNICA: mudou aqui → muda em todo app.
 *
 * RUL-10 (full-page): renderizado via `createPortal(..., document.body)` para
 * que o overlay `fixed inset-0` cubra a VIEWPORT inteira (rail, header, rodapé).
 * Sem o portal, um ancestral com `transform`/`filter`/`will-change` (ex.: o
 * wrapper `animate-fade-in-up` da casca) cria containing-block e prende o
 * `position: fixed` à área de conteúdo. O portal escapa desses ancestrais.
 */
declare function Modal({ open, onClose, title, description, children, footer, size }: ModalProps): React.ReactPortal | null;

declare function Avatar({ className, size, ...props }: Avatar$1.Root.Props & {
    size?: 'default' | 'sm' | 'lg';
}): React.JSX.Element;
declare function AvatarImage({ className, ...props }: Avatar$1.Image.Props): React.JSX.Element;
declare function AvatarFallback({ className, ...props }: Avatar$1.Fallback.Props): React.JSX.Element;
declare function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>): React.JSX.Element;
declare function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element;
declare function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined;
    size?: "sm" | "lg" | "default" | "xs" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, ...props }: Button$1.Props & VariantProps<typeof buttonVariants>): React.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Badge({ className, variant, render, ...props }: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;

declare function Card({ className, size, ...props }: React.ComponentProps<"div"> & {
    size?: "default" | "sm";
}): React.JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;

declare function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
declare function SkeletonKpiCard(): React.JSX.Element;
declare function SkeletonTableRow({ cols }: {
    cols?: number;
}): React.JSX.Element;
declare function SkeletonTable({ rows, cols }: {
    rows?: number;
    cols?: number;
}): React.JSX.Element;
declare function Loading(): React.JSX.Element;
declare const SkeletonPage: typeof Loading;
declare function TabLoading(): React.JSX.Element;

interface KpiCardProps {
    label: string;
    value: ReactNode;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
    trend?: string | null;
    trendUp?: boolean;
    hint?: string;
}
declare function KpiCard({ label, value, icon: Icon, iconBg, iconColor, trend, trendUp, hint, }: KpiCardProps): React.JSX.Element;
declare function KpiGrid({ children, className, cols, }: {
    children: ReactNode;
    className?: string;
    cols?: 3 | 4 | 5;
}): React.JSX.Element;

declare function Table({ className, ...props }: React.ComponentProps<"table">): React.JSX.Element;
declare function TableHeader({ className, ...props }: React.ComponentProps<"thead">): React.JSX.Element;
declare function TableBody({ className, ...props }: React.ComponentProps<"tbody">): React.JSX.Element;
declare function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">): React.JSX.Element;
declare function TableRow({ className, ...props }: React.ComponentProps<"tr">): React.JSX.Element;
declare function TableHead({ className, ...props }: React.ComponentProps<"th">): React.JSX.Element;
declare function TableCell({ className, ...props }: React.ComponentProps<"td">): React.JSX.Element;
declare function TableCaption({ className, ...props }: React.ComponentProps<"caption">): React.JSX.Element;

type ToastVariant = "default" | "destructive" | "success" | "info";
interface ToastOptions {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant?: ToastVariant | "outline";
}
interface ToastItem {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant: ToastVariant;
}
declare function baseToast(opts: ToastOptions): {
    id: string;
    dismiss: () => void;
    update: (next: ToastOptions) => void;
};
declare const toast: typeof baseToast & {
    success: (message: React.ReactNode) => {
        id: string;
        dismiss: () => void;
        update: (next: ToastOptions) => void;
    };
    error: (message: React.ReactNode) => {
        id: string;
        dismiss: () => void;
        update: (next: ToastOptions) => void;
    };
    info: (message: React.ReactNode) => {
        id: string;
        dismiss: () => void;
        update: (next: ToastOptions) => void;
    };
};
declare function useToast(): {
    toasts: ToastItem[];
    toast: typeof baseToast & {
        success: (message: React.ReactNode) => {
            id: string;
            dismiss: () => void;
            update: (next: ToastOptions) => void;
        };
        error: (message: React.ReactNode) => {
            id: string;
            dismiss: () => void;
            update: (next: ToastOptions) => void;
        };
        info: (message: React.ReactNode) => {
            id: string;
            dismiss: () => void;
            update: (next: ToastOptions) => void;
        };
    };
    dismiss: (id?: string) => void;
};
declare function Toaster(): React.ReactPortal | null;

declare const SIZES: {
    readonly sm: "h-1.5 w-1.5";
    readonly md: "h-2 w-2";
    readonly lg: "h-2.5 w-2.5";
};
interface StatusDotProps {
    /** Classe de cor de fundo, ex.: "bg-verde", "bg-red-400", "bg-roxo". */
    color: string;
    /** Anel pulsante (animate-ping) — use para estados "vivos" (online/ao vivo). */
    pulse?: boolean;
    size?: keyof typeof SIZES;
    /** Extras no wrapper (ex.: "mr-1.5" quando fica antes de um label). */
    className?: string;
}
declare function StatusDot({ color, pulse, size, className }: StatusDotProps): React.JSX.Element;

type StatusVariant = "online" | "offline" | "pairing" | "warning" | "neutral";
interface StatusBadgeProps {
    label: string;
    /** Variante semântica com tom pronto. Ignorada nos campos que você sobrescrever. */
    variant?: StatusVariant;
    /** Sobrescreve a cor do StatusDot (classe bg-*). */
    color?: string;
    /** Sobrescreve as classes da pílula (bg/text/border). */
    pillClassName?: string;
    /** Sobrescreve o pulso do dot. */
    pulse?: boolean;
    size?: "sm" | "md";
    className?: string;
}
declare function StatusBadge({ label, variant, color, pillClassName, pulse, size, className, }: StatusBadgeProps): React.JSX.Element;
type DeviceStatus = "online" | "offline" | "pairing" | (string & {});
/**
 * Mapa canônico de status de device → rótulo PT + variante + pulso.
 * Centraliza a divergência histórica ("Pareando" vs "Aguardando aparelho"):
 * rótulo canônico do device = statusLabel do devices ("Pareando").
 */
declare function deviceStatusMeta(status: DeviceStatus): {
    label: string;
    variant: StatusVariant;
    pulse: boolean;
};
interface DeviceStatusBadgeProps {
    status: DeviceStatus;
    size?: "sm" | "md";
    className?: string;
}
/** Badge de status de device pronto: recebe só o status e resolve rótulo/tom. */
declare function DeviceStatusBadge({ status, size, className }: DeviceStatusBadgeProps): React.JSX.Element;

declare const TRACK: {
    readonly sm: "h-5 w-9";
    readonly default: "h-6 w-11";
};
interface SwitchProps {
    /** Estado ligado/desligado (controlado). */
    checked: boolean;
    /** Chamado com o novo estado ao alternar. */
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: keyof typeof TRACK;
    /** Rótulo acessível (aria-label) — obrigatório quando não há <label> visível. */
    label?: string;
    /** Classe de cor do trilho quando ligado (default: primary/roxo). */
    color?: string;
    id?: string;
    className?: string;
}
declare function Switch({ checked, onCheckedChange, disabled, size, label, color, id, className, }: SwitchProps): React.JSX.Element;

type Compare = "period" | "year";
interface RangeValue {
    preset: string;
    from: string;
    to: string;
    compare: Compare;
}
declare const PRESETS: {
    id: string;
    label: string;
}[];
declare function computePreset(id: string): {
    from: string;
    to: string;
};
declare function comparisonRange(from: string, to: string, compare: Compare): {
    from: string;
    to: string;
};
declare function defaultRange(): RangeValue;
interface DateRangePickerProps {
    value: RangeValue;
    onApply: (v: RangeValue) => void;
}
declare function DateRangePicker({ value, onApply }: DateRangePickerProps): React.JSX.Element;

interface RailItem {
    id: string;
    label: string;
    icon: LucideIcon;
    /** Contador de notificação (bolinha vermelha). Ausente/0 = sem badge. */
    badge?: number;
}
interface AppRailProps {
    items: RailItem[];
    /** Itens de baixo (logs/ajuda etc.) — separados do bloco principal. */
    bottomItems?: RailItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    onPrefetch?: (id: string) => void;
    logoSrc?: string;
    /** Botão "expandir menu" (quando a sidebar secundária está recolhida). */
    onExpand?: () => void;
    /** Esconde no mobile (`hidden lg:flex`). Default: sempre visível. */
    hideOnMobile?: boolean;
}
declare const AppRail: React.NamedExoticComponent<AppRailProps>;

interface ContentHeaderProps {
    /** Ícone do módulo — vai na caixa roxa (rounded-xl bg-roxo/10 text-roxo). */
    icon: LucideIcon;
    /** Título do módulo (ex.: "Dispositivos"). */
    moduleTitle: string;
    /** Segmento após o "·" (ex.: "Detalhe" em páginas de detalhe). */
    subTitle?: string;
    /** Linha pequena cinza abaixo do título. */
    description?: string;
    /** Substitui TODO o bloco da esquerda (para headers de detalhe customizados). */
    customLeft?: ReactNode;
    /** Ações à direita (busca, notificações, avatar, status) — `flex items-center gap-3`. */
    children?: ReactNode;
    className?: string;
}
declare function ContentHeader({ icon: Icon, moduleTitle, subTitle, description, customLeft, children, className, }: ContentHeaderProps): React.JSX.Element;

declare const AppFooter: React.NamedExoticComponent<object>;

interface PageFrameProps {
    /** Rail de navegação (AppRail). */
    rail: ReactNode;
    /** Header de topo do mobile. */
    mobileHeader?: ReactNode;
    /** Slots extras fora do fluxo (sidebar secundária, overlays, lightboxes). */
    extras?: ReactNode;
    /** Header sticky de conteúdo (ContentHeader) — envolto em sticky + hidden lg:block. */
    header?: ReactNode;
    /** Título de página no mobile (h1). */
    mobileTitle?: ReactNode;
    /** Rodapé (dentro do scroll, ao fim do conteúdo). */
    footer?: ReactNode;
    /** Barra de navegação inferior do mobile. */
    mobileBottomNav?: ReactNode;
    children: ReactNode;
    /** id da região <main> = alvo do skip-link (ex.: "conteudo" | "main-content"). */
    mainId: string;
    /** Classes do respiro/margem da área de conteúdo (variam por app: submenu, ml do rail). */
    contentAreaClassName?: string;
    /** Página full-bleed (mapa etc.): sem scroll, card com overflow-hidden. */
    fullBleed?: boolean;
    /** key do bloco de conteúdo (reinicia o animate-fade-in-up ao trocar de página). */
    contentKey?: string;
}
declare function PageFrame({ rail, mobileHeader, extras, header, mobileTitle, footer, mobileBottomNav, children, mainId, contentAreaClassName, fullBleed, contentKey, }: PageFrameProps): React.JSX.Element;

interface BottomNavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}
interface AppBottomNavProps {
    items: BottomNavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
}
declare const AppBottomNav: React.NamedExoticComponent<AppBottomNavProps>;

interface AppMobileHeaderProps {
    /** Se fornecido, mostra o botão de hambúrguer à esquerda do logo. */
    onMenuToggle?: () => void;
    logoSrc?: string;
    /** Ações extras à esquerda do menu do usuário (busca, sino…). */
    actions?: ReactNode;
    /** Menu do usuário (avatar + Sair) — normalmente <UserMenu/>. */
    userMenu: ReactNode;
}
declare function AppMobileHeader({ onMenuToggle, logoSrc, actions, userMenu }: AppMobileHeaderProps): React.JSX.Element;

interface UserMenuItem {
    label: string;
    icon?: LucideIcon;
    /** Ação ao clicar (fecha o menu antes de executar). */
    onClick?: () => void;
    /** Alternativa a onClick: navega para um href (link). */
    href?: string;
}
interface UserMenuProps {
    name?: string;
    email?: string;
    avatarUrl?: string;
    /** Iniciais para o fallback do avatar (ex.: "AJ"). */
    initials: string;
    /** Itens extras entre o header e o "Sair" (ex.: Minha Conta, Configurações). */
    items?: UserMenuItem[];
    /** Atalho: adiciona um item "Minha Conta" (ícone User) que navega para o href. */
    accountHref?: string;
    /** Tema atual escuro? Quando `onToggleTheme` existe, mostra o toggle de tema. */
    isDark?: boolean;
    /** Alterna o tema claro/escuro. Se ausente, o toggle de tema não aparece. */
    onToggleTheme?: () => void;
    onLogout: () => void;
    /** Tamanho do avatar: "sm" (h-8, mobile, default) ou "md" (h-10, header). */
    avatarSize?: "sm" | "md";
}
declare function UserMenu({ name, email, avatarUrl, initials, items, accountHref, isDark, onToggleTheme, onLogout, avatarSize, }: UserMenuProps): React.JSX.Element;

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}
declare function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps): React.JSX.Element;
declare function SearchEmptyState({ query }: {
    query: string;
}): React.JSX.Element;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

declare const Label: React.ForwardRefExoticComponent<React.LabelHTMLAttributes<HTMLLabelElement> & React.RefAttributes<HTMLLabelElement>>;

declare function Separator({ className, orientation, ...props }: Separator$1.Props): React.JSX.Element;

declare function TooltipProvider({ delay, ...props }: Tooltip$1.Provider.Props): React.JSX.Element;
declare function Tooltip({ ...props }: Tooltip$1.Root.Props): React.JSX.Element;
declare function TooltipTrigger({ ...props }: Tooltip$1.Trigger.Props): React.JSX.Element;
declare function TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: Tooltip$1.Popup.Props & Pick<Tooltip$1.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">): React.JSX.Element;

declare function DropdownMenu({ ...props }: Menu.Root.Props): React.JSX.Element;
declare function DropdownMenuPortal({ ...props }: Menu.Portal.Props): React.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: Menu.Trigger.Props): React.JSX.Element;
declare function DropdownMenuContent({ align, alignOffset, side, sideOffset, className, ...props }: Menu.Popup.Props & Pick<Menu.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">): React.JSX.Element;
declare function DropdownMenuGroup({ ...props }: Menu.Group.Props): React.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: Menu.GroupLabel.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: Menu.Item.Props & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React.JSX.Element;
declare function DropdownMenuSub({ ...props }: Menu.SubmenuRoot.Props): React.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ...props }: Menu.SubmenuTrigger.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSubContent({ align, alignOffset, side, sideOffset, className, ...props }: React.ComponentProps<typeof DropdownMenuContent>): React.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, inset, ...props }: Menu.CheckboxItem.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: Menu.RadioGroup.Props): React.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, inset, ...props }: Menu.RadioItem.Props & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props): React.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;

declare const Select: React.FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: React.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}
declare function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, destructive, loading, onConfirm, onClose, }: ConfirmDialogProps): React.JSX.Element;

declare const AlertDialog: React.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare const AlertDialogOverlay: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogOverlayProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const AlertDialogContent: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
    ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
    displayName: string;
};
declare const AlertDialogFooter: {
    ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
    displayName: string;
};
declare const AlertDialogTitle: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref"> & React.RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: React.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;

declare function cn(...inputs: ClassValue[]): string;

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AppBottomNav, type AppBottomNavProps, AppFooter, AppMobileHeader, type AppMobileHeaderProps, AppRail, type AppRailProps, Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, Badge, type BottomNavItem, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type Compare, ConfirmDialog, type ConfirmDialogProps, ContentHeader, type ContentHeaderProps, DateRangePicker, type DateRangePickerProps, type DeviceStatus, DeviceStatusBadge, type DeviceStatusBadgeProps, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, type EmptyStateProps, Input, type InputProps, KpiCard, type KpiCardProps, KpiGrid, Label, Loading, Modal, type ModalProps, PRESETS, PageFrame, type PageFrameProps, type RailItem, type RangeValue, SearchEmptyState, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, Skeleton, SkeletonKpiCard, SkeletonPage, SkeletonTable, SkeletonTableRow, StatusBadge, type StatusBadgeProps, StatusDot, type StatusDotProps, type StatusVariant, Switch, type SwitchProps, TabLoading, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, type ToastOptions, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UserMenu, type UserMenuItem, type UserMenuProps, badgeVariants, buttonVariants, cn, comparisonRange, computePreset, defaultRange, deviceStatusMeta, toast, useToast };
