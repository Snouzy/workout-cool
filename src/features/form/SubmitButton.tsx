"use client";

import { useFormStatus } from "react-dom";

import type { ComponentPropsWithoutRef } from "react";
import type { ButtonProps } from "@/components/ui/button";

import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";


export const SubmitButton = (props: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <LoadingButton loading={pending} {...props}>
      {props.children}
    </LoadingButton>
  );
};

export const LoadingButton = ({ loading, ...props }: ButtonProps & { loading?: boolean }) => {
  return (
    <Button {...props}>
      {loading ? (
        <>
          <Loader className="mr-2" size={16} /> {props.children}
        </>
      ) : (
        props.children
      )}
    </Button>
  );
};

export const SubmitButtonUnstyled = (props: ComponentPropsWithoutRef<"button">) => {
  const { pending } = useFormStatus();

  return <button {...props} disabled={props.disabled ?? pending} type={props.type ?? "submit"} />;
};
