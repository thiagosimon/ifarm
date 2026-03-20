/// <reference types="@testing-library/jest-dom" />

// Fix recharts compatibility with @types/react 18.x
declare module 'recharts' {
  import { ComponentType, ReactNode, SVGProps } from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    aspect?: number;
    minWidth?: number;
    minHeight?: number;
    debounce?: number;
    children?: ReactNode;
    className?: string;
  }
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;

  export interface AreaChartProps {
    data?: object[];
    width?: number;
    height?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children?: ReactNode;
    className?: string;
  }
  export const AreaChart: ComponentType<AreaChartProps>;

  export interface BarChartProps {
    data?: object[];
    width?: number;
    height?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children?: ReactNode;
    className?: string;
    barSize?: number;
  }
  export const BarChart: ComponentType<BarChartProps>;

  export interface PieChartProps {
    width?: number;
    height?: number;
    children?: ReactNode;
    className?: string;
  }
  export const PieChart: ComponentType<PieChartProps>;

  export interface LineChartProps {
    data?: object[];
    width?: number;
    height?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children?: ReactNode;
    className?: string;
  }
  export const LineChart: ComponentType<LineChartProps>;

  export interface AreaProps {
    type?: string;
    dataKey: string;
    stackId?: string;
    stroke?: string;
    fill?: string;
    fillOpacity?: number;
    strokeWidth?: number;
    dot?: boolean | object;
    activeDot?: boolean | object;
    name?: string;
  }
  export const Area: ComponentType<AreaProps>;

  export interface BarProps {
    dataKey: string;
    fill?: string;
    radius?: number | number[];
    name?: string;
    stackId?: string;
    maxBarSize?: number;
  }
  export const Bar: ComponentType<BarProps>;

  export interface LineProps {
    type?: string;
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | object;
    activeDot?: boolean | object;
    name?: string;
  }
  export const Line: ComponentType<LineProps>;

  export interface PieProps {
    cx?: string | number;
    cy?: string | number;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    dataKey: string;
    data?: object[];
    label?: boolean | ((props: object) => ReactNode);
    children?: ReactNode;
    nameKey?: string;
  }
  export const Pie: ComponentType<PieProps>;

  export interface CellProps {
    key?: string;
    fill?: string;
    stroke?: string;
  }
  export const Cell: ComponentType<CellProps>;

  export interface XAxisProps {
    dataKey?: string;
    className?: string;
    tickFormatter?: (value: unknown) => string;
    tick?: boolean | object;
    axisLine?: boolean;
    tickLine?: boolean;
    type?: string;
  }
  export const XAxis: ComponentType<XAxisProps>;

  export interface YAxisProps {
    className?: string;
    tickFormatter?: (value: unknown) => string;
    tick?: boolean | object;
    axisLine?: boolean;
    tickLine?: boolean;
    width?: number;
  }
  export const YAxis: ComponentType<YAxisProps>;

  export interface TooltipProps {
    formatter?: (value: unknown, name: string) => [string, string];
    contentStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    cursor?: boolean | object;
  }
  export const Tooltip: ComponentType<TooltipProps>;

  export interface CartesianGridProps {
    strokeDasharray?: string;
    className?: string;
    stroke?: string;
    vertical?: boolean;
    horizontal?: boolean;
  }
  export const CartesianGrid: ComponentType<CartesianGridProps>;

  export interface LegendProps {
    className?: string;
    iconType?: string;
    formatter?: (value: string) => ReactNode;
  }
  export const Legend: ComponentType<LegendProps>;
}

// Fix react-hot-toast Toaster type issue
declare module 'react-hot-toast' {
  export interface ToastOptions {
    duration?: number;
    style?: React.CSSProperties;
    className?: string;
    position?: string;
  }
  export interface ToasterProps {
    position?: string;
    toastOptions?: ToastOptions;
    gutter?: number;
    containerStyle?: React.CSSProperties;
  }
  export const Toaster: React.FC<ToasterProps>;
  const toast: {
    (message: string, options?: ToastOptions): string;
    success(message: string, options?: ToastOptions): string;
    error(message: string, options?: ToastOptions): string;
    loading(message: string, options?: ToastOptions): string;
    dismiss(id?: string): void;
    remove(id?: string): void;
  };
  export default toast;
}
