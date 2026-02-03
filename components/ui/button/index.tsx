'use client';
import React from 'react';
import { createButton } from '@gluestack-ui/core/button/creator';
import { tva ,
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';

import { cssInterop } from 'nativewind';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';

const SCOPE = 'BUTTON';

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const buttonStyle = tva({
  base: 'group/button rounded bg-transparent flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2',
  variants: {
    action: {
      primary: 'bg-transparent border-primary-300',
      secondary: 'bg-transparent border-secondary-300',
      positive: 'bg-transparent border-success-300',
      negative: 'bg-transparent border-error-300',
      default: 'bg-transparent',
    },
    variant: {
      link: 'px-0',
      outline: 'bg-transparent border',
      solid: '',
    },
    size: {
      xs: 'px-3.5 h-8',
      sm: 'px-4 h-9',
      md: 'px-5 h-10',
      lg: 'px-6 h-11',
      xl: 'px-7 h-12',
    },
  },
  compoundVariants: [
    { action: 'primary', variant: 'link', class: 'px-0 bg-transparent' },
    { action: 'secondary', variant: 'link', class: 'px-0 bg-transparent' },
    { action: 'positive', variant: 'link', class: 'px-0 bg-transparent' },
    { action: 'negative', variant: 'link', class: 'px-0 bg-transparent' },
    { action: 'primary', variant: 'outline', class: 'bg-transparent' },
    { action: 'secondary', variant: 'outline', class: 'bg-transparent' },
    { action: 'positive', variant: 'outline', class: 'bg-transparent' },
    { action: 'negative', variant: 'outline', class: 'bg-transparent' },
  ],
});

const buttonTextStyle = tva({
  base: 'text-typography-0 font-semibold web:select-none',
  parentVariants: {
    action: {
      primary: 'text-primary-600',
      secondary: 'text-typography-500',
      positive: 'text-success-600',
      negative: 'text-error-600',
    },
    variant: {
      link: 'data-[hover=true]:underline',
      outline: '',
      solid: 'text-typography-0',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
});

const buttonIconStyle = tva({
  base: 'fill-none',
  parentVariants: {
    variant: {
      link: 'data-[hover=true]:underline',
      outline: '',
      solid: 'text-typography-0',
    },
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-[18px] w-[18px]',
      xl: 'h-5 w-5',
    },
    action: {
      primary: 'text-primary-600',
      secondary: 'text-typography-500',
      positive: 'text-success-600',
      negative: 'text-error-600',
    },
  },
});

const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    isAttached: { true: 'gap-0' },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  'context'
> &
  VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<React.ElementRef<typeof UIButton>, IButtonProps>(
  ({ className, variant = 'solid', size = 'md', action = 'primary', ...props }, ref) => {
    return (
      <UIButton
        ref={ref}
        {...props}
        className={buttonStyle({ variant, size, action, class: className })}
        context={{ variant, size, action }}
      />
    );
  }
);

const ButtonText = React.forwardRef<React.ElementRef<typeof UIButton.Text>, any>(
  ({ className, variant, size, action, ...props }, ref) => {
    const { variant: parentVariant, size: parentSize, action: parentAction } =
      useStyleContext(SCOPE);

    return (
      <UIButton.Text
        ref={ref}
        {...props}
        className={buttonTextStyle({
          parentVariants: { variant: parentVariant, size: parentSize, action: parentAction },
          variant,
          size,
          action,
          class: className,
        })}
      />
    );
  }
);

const ButtonSpinner = UIButton.Spinner;

const ButtonIcon = React.forwardRef<React.ElementRef<typeof UIButton.Icon>, any>(
  ({ className, size, ...props }, ref) => {
    const { variant: parentVariant, size: parentSize, action: parentAction } =
      useStyleContext(SCOPE);

    return (
      <UIButton.Icon
        {...props}
        className={buttonIconStyle({
          parentVariants: { size: parentSize, variant: parentVariant, action: parentAction },
          size,
          class: className,
        })}
        ref={ref}
      />
    );
  }
);

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof UIButton.Group>,
  IButtonGroupProps
>(
  (
    {
      className,
      space = 'md',
      isAttached = false,
      flexDirection = 'column',
      ...props
    },
    ref
  ) => {
    return (
      <UIButton.Group
        className={buttonGroupStyle({
          class: className,
          space,
          isAttached: isAttached as boolean,
          flexDirection: flexDirection as any,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
