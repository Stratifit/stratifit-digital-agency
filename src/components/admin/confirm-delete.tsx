"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function DeleteButtonInner({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="small" loading={pending}>
      {label}
    </Button>
  );
}

export function ConfirmDelete({
  action,
  title = "Delete item",
  description = "This action cannot be undone.",
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  title?: string;
  description?: string;
  label?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="small">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <form action={action}>
            <DeleteButtonInner label="Confirm Delete" />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
