"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "primary";
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant="primary",
}: FormButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={disabled || pending}
      type="submit"
      variant={variant}
      size="sm"
      className={cn(className)}
    >
      {children}
    </Button>
  );
};
