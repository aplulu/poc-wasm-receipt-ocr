import { Button as KumaButton } from '@kuma-ui/core';

export type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <KumaButton disabled={disabled} px={8} py={4} onClick={onClick}>
      {children}
    </KumaButton>
  );
};
