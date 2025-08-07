import type { ComponentPropsWithoutRef } from "react";

interface IButton extends ComponentPropsWithoutRef<"button"> {}

const Button: React.FC<IButton> = ({ className, children, ...rest }) => {
  return (
    <button className={"custom-button " + className} {...rest}>
      {children}
    </button>
  );
};

export default Button;
