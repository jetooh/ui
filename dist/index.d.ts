import * as React from 'react';
import { ReactNode } from 'react';
import { Avatar as Avatar$1 } from '@base-ui/react/avatar';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { Button as Button$1 } from '@base-ui/react/button';
import { VariantProps } from 'class-variance-authority';
import { useRender } from '@base-ui/react/use-render';
import { LucideIcon } from 'lucide-react';
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
 * Fonte ÚNICA: mudou aqui → muda em todo app que consome @jetooh/ui.
 */
declare function Modal({ open, onClose, title, description, children, footer, size }: ModalProps): React.JSX.Element | null;

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

declare function cn(...inputs: ClassValue[]): string;

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, Badge, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, KpiCard, type KpiCardProps, KpiGrid, Loading, Modal, type ModalProps, Skeleton, SkeletonKpiCard, SkeletonPage, SkeletonTable, SkeletonTableRow, StatusDot, type StatusDotProps, TabLoading, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, type ToastOptions, Toaster, badgeVariants, buttonVariants, cn, toast, useToast };
