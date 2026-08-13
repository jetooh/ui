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
    /** Largura máxima do card. Régua do platform = md. `xl`/`2xl` para forms densos. */
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'screen';
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

declare function BrandLoading(): React.JSX.Element;

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
    /**
     * Classe de cor de fundo, ex.: "bg-verde-dark", "bg-red-400", "bg-roxo".
     * Dot SOZINHO precisa de 3:1 sobre a superfície (WCAG 1.4.11) — use o grau de
     * legibilidade (`bg-verde-dark`), não o de preenchimento (`bg-verde`).
     */
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

interface SidebarNavItem {
    /** Identificador do item — rota (`/config/roles`) ou chave de página (`settings.team`). */
    id: string;
    label: string;
    icon: LucideIcon;
    /** Contador de notificação (bolinha vermelha à direita). Ausente/0 = sem badge. */
    badge?: number;
}
interface SidebarSection {
    heading: string;
    items: SidebarNavItem[];
}
interface AppSecondarySidebarProps {
    /** Seções do domínio/módulo ativo. Vazio = sidebar não renderiza (null). */
    sections: SidebarSection[];
    activeId: string;
    onNavigate: (id: string) => void;
    onPrefetch?: (id: string) => void;
    /** Widgets contextuais abaixo da navegação (ex.: KPIs do platform). */
    footer?: ReactNode;
    /** Quando fornecido, mostra o botão "Recolher" no rodapé do aside. */
    onCollapse?: () => void;
    /** Rótulo do botão de recolher. Default: "Recolher". */
    collapseLabel?: string;
    /** Esconde no mobile (`hidden lg:flex`). Default: sempre visível. */
    hideOnMobile?: boolean;
    className?: string;
}
declare const AppSecondarySidebar: React.NamedExoticComponent<AppSecondarySidebarProps>;
interface AppSubNavProps {
    /** Itens (flat) do domínio/módulo ativo. Com 0 ou 1 item a barra não renderiza. */
    items: SidebarNavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    className?: string;
}
/**
 * Sub-navegação do MOBILE (a mesma "sub menu" da sidebar, em barra horizontal no
 * topo do conteúdo). O bottom-nav mostra só os domínios; aqui os subitens ficam
 * alcançáveis. Some quando o domínio tem 1 rota só.
 */
declare const AppSubNav: React.NamedExoticComponent<AppSubNavProps>;

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

/** Rótulos canônicos dos itens padrão — iguais em todas as apps do tema. */
declare const USER_MENU_PROFILE_LABEL = "Minha Conta";
declare const USER_MENU_SETTINGS_LABEL = "Configura\u00E7\u00F5es";
interface AppUserMenuProps {
    name?: string;
    email?: string;
    avatarUrl?: string;
    /** Iniciais do fallback do avatar (ex.: "AJ"). */
    initials: string;
    /** Ação do item padrão "Minha Conta". Ausente = o item não aparece. */
    onProfile?: () => void;
    /** Ação do item padrão "Configurações". Ausente = o item não aparece. */
    onSettings?: () => void;
    /** Itens específicos da app, sempre depois dos padrão (ex.: Idioma). */
    extraItems?: UserMenuItem[];
    /** Tema atual escuro? Com `onToggleTheme`, mostra o switch de tema. */
    isDark?: boolean;
    onToggleTheme?: () => void;
    onLogout: () => void;
    /** "md" (h-10) no header desktop; "sm" (h-8) no header mobile. Default: "md". */
    avatarSize?: "sm" | "md";
}
declare function AppUserMenu({ name, email, avatarUrl, initials, onProfile, onSettings, extraItems, isDark, onToggleTheme, onLogout, avatarSize, }: AppUserMenuProps): React.JSX.Element;

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

interface DateTimeFieldProps {
    id: string;
    label?: React.ReactNode;
    /** Valor em ISO 8601 (UTC) ou null/'' (vazio). */
    value: string | null;
    /** Recebe ISO (UTC), ou null quando o campo é limpo. */
    onChange: (isoOrNull: string | null) => void;
    /** Limites opcionais, em ISO (UTC). */
    min?: string | null;
    max?: string | null;
    disabled?: boolean;
    /** Texto de apoio abaixo do campo. */
    hint?: React.ReactNode;
    className?: string;
}
/**
 * DateTimeField — PADRÃO do tema Dashboard2026 para data + hora num ÚNICO campo.
 * Usa `<input type="datetime-local">` nativo (data e hora juntas, com o picker do
 * SO), na régua de form do `@jetooh/ui` (mesmo estilo do `Input`) + ícone. Na
 * BORDA trabalha em ISO 8601/UTC (`value`/`onChange`) e converte de/para a hora
 * LOCAL do usuário internamente. Use em qualquer app do tema no lugar de pares
 * soltos de data + hora (menos campos, menos erro, toque amigável).
 */
declare function DateTimeField({ id, label, value, onChange, min, max, disabled, hint, className, }: DateTimeFieldProps): React.JSX.Element;

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

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Classe extra no wrapper (posicionamento/margem). */
    wrapperClassName?: string;
}
declare const NativeSelect: React.ForwardRefExoticComponent<NativeSelectProps & React.RefAttributes<HTMLSelectElement>>;

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

/** Cores da camada de boot. Ver o mapeamento para a escala JETOOH acima. */
declare const BOOT_COLORS: {
    /** Fundo do splash de boot. `colors.preto` (valor do modo claro, ver ressalva). */
    readonly bg: "#0B0F0C";
    /** Anel de progresso e cor de marca do `<meta name="theme-color">`. `colors.roxo`. */
    readonly ring: "#8B47FF";
    /** Rastro do anel: `ring` a 30%. Escrito em rgba() porque o anel gira antes do CSS da app. */
    readonly ringTrail: "rgba(139, 71, 255, 0.3)";
    /** Preenchimento do logo. `colors['branco-fixo']` — branco de verdade, nos dois modos. */
    readonly logo: "#ffffff";
};
/**
 * Chave do localStorage lida pelo `theme-init.js` e escrita pelo seletor de tema
 * da app. Está aqui para que a app não redigite a string: se ela divergir do
 * bootstrap, o modo escuro volta a piscar e nada quebra visivelmente no teste.
 */
declare const BOOT_THEME_STORAGE_KEY = "theme";
/** Valor que o `theme-init.js` reconhece como "escuro" na chave acima. */
declare const BOOT_THEME_DARK_VALUE = "dark";
/**
 * `d` do logo JETOOH (viewBox 0 0 512 512). Fonte única do desenho: o
 * <BrandLoading /> (React, pós-hidratação) e o `boot.html` (pré-hidratação)
 * mostram o MESMO logo, e o boot.test.ts falha se um dos dois for editado
 * sozinho.
 */
declare const BOOT_LOGO_PATH = "M247.26,29.65C67.56,37.31-33.89,241.82,72.17,388.72c104.35,144.53,327.7,117.1,394.22-47.79C527.76,188.81,410.5,22.69,247.26,29.65ZM179.39,365.5c-33.69,1.47-64.42-21.23-76.28-52.12-.85-2.2-4.64-12.97-4.64-14.47v-95.8c32.69-.77,63.54,21.36,75.31,51.4,1.43,3.64,5.61,16.95,5.61,20.24v90.75ZM286.15,296.11c0,2.68-3.87,14.28-5.05,17.43-11.34,30.28-43.02,53.37-75.87,51.97v-173.91c0-2.38,3.44-13.47,4.48-16.31,11.01-30.16,43.87-54.03,76.43-52.53v173.35ZM391.79,365.5c-31.67,1.6-63.55-20.91-75.16-49.86-1.27-3.18-5.75-16.86-5.75-19.53v-92.15c2.97-1.55,8.55-.67,12.01-.21,28.96,3.85,54.16,24.92,64.26,52.05.93,2.5,4.64,13.68,4.64,15.59v94.12Z";

interface SectionCardProps {
    /** Ícone semântico da seção (mesma coisa → mesmo ícone). */
    icon?: LucideIcon;
    title: string;
    /** Ação à direita do título (ex.: botão "Novo"). */
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    /** Respiro do corpo. Omitido = corpo rente (tabelas/listas cuidam do próprio). */
    bodyClassName?: string;
}
declare function SectionCard({ icon: Icon, title, action, children, className, bodyClassName }: SectionCardProps): React.JSX.Element;

interface SegmentedTabItem<T extends string = string> {
    id: T;
    label: string;
    icon?: LucideIcon;
    /** Contador opcional (pílula ao lado do rótulo). Omitido/0 = não renderiza. */
    badge?: number | string;
}
interface SegmentedTabsProps<T extends string> {
    items: SegmentedTabItem<T>[];
    value: T;
    onChange: (id: T) => void;
    className?: string;
    ariaLabel?: string;
}
declare function SegmentedTabs<T extends string>({ items, value, onChange, className, ariaLabel, }: SegmentedTabsProps<T>): React.JSX.Element;

interface DetailHeaderProps {
    onBack: () => void;
    /** aria-label do botão voltar. */
    backLabel?: string;
    title: string;
    /** Adorno após o título (ex.: ISO do país em cinza). */
    titleAdornment?: ReactNode;
    status?: {
        label: string;
        variant: StatusBadgeProps['variant'];
    };
    /** Ação à direita (ex.: bloquear/inativar). */
    action?: ReactNode;
}
declare function DetailHeader({ onBack, backLabel, title, titleAdornment, status, action }: DetailHeaderProps): React.JSX.Element;

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AppBottomNav, type AppBottomNavProps, AppFooter, AppMobileHeader, type AppMobileHeaderProps, AppRail, type AppRailProps, AppSecondarySidebar, type AppSecondarySidebarProps, AppSubNav, type AppSubNavProps, AppUserMenu, type AppUserMenuProps, Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, BOOT_COLORS, BOOT_LOGO_PATH, BOOT_THEME_DARK_VALUE, BOOT_THEME_STORAGE_KEY, Badge, type BottomNavItem, BrandLoading, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type Compare, ConfirmDialog, type ConfirmDialogProps, ContentHeader, type ContentHeaderProps, DateRangePicker, type DateRangePickerProps, DateTimeField, type DateTimeFieldProps, DetailHeader, type DetailHeaderProps, type DeviceStatus, DeviceStatusBadge, type DeviceStatusBadgeProps, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EmptyState, type EmptyStateProps, Input, type InputProps, KpiCard, type KpiCardProps, KpiGrid, Label, Loading, Modal, type ModalProps, NativeSelect, type NativeSelectProps, PRESETS, PageFrame, type PageFrameProps, type RailItem, type RangeValue, SearchEmptyState, SectionCard, type SectionCardProps, type SegmentedTabItem, SegmentedTabs, type SegmentedTabsProps, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, type SidebarNavItem, type SidebarSection, Skeleton, SkeletonKpiCard, SkeletonPage, SkeletonTable, SkeletonTableRow, StatusBadge, type StatusBadgeProps, StatusDot, type StatusDotProps, type StatusVariant, Switch, type SwitchProps, TabLoading, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, type ToastOptions, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, USER_MENU_PROFILE_LABEL, USER_MENU_SETTINGS_LABEL, UserMenu, type UserMenuItem, type UserMenuProps, badgeVariants, buttonVariants, cn, comparisonRange, computePreset, defaultRange, deviceStatusMeta, toast, useToast };
