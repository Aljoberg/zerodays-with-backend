"use client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Session } from "next-auth";
import { State } from "../interfaces";
import { useEffect, useState } from "react";
export default function Navbar({
  action: actionn,
  session,
}: {
  action: (state: State | null, data: FormData) => Promise<State>;
  session: Session | null;
}) {
  let [state, action] = useFormState(actionn, null);
  let [open, setOpen] = useState(false);
  useEffect(() => {
    if (state?.status == "error") setOpen(true);
    else if (state?.status == "success") setOpen(false);
    if (state?.status == "error") alert(`Error: ${state?.message}`); // TODO: spremeni v shadcdn Alert alpa kaj podobnega
  }, [state]);
  return (
    <div className="flex flex-wrap items-center justify-between bg-slate-800 p-5">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <span className="text-xl font-semibold tracking-tight">
          zerodays challenge
        </span>
      </div>
      <div className="block lg:hidden">
        <button
          id="menu-button"
          className="flex items-center rounded border border-gray-400 px-3 py-2 text-gray-400 hover:border-white hover:text-white"
        >
          <img
            className="h-6"
            src="/static_files/svgs/bars-solid.svg"
            alt="Menu"
          />
        </button>
      </div>
      <div
        id="menu"
        className="block w-full flex-grow lg:flex lg:w-auto lg:items-center"
      >
        <div className="text-sm lg:flex-grow">
          {session && (
            <p className="mr-4 mt-4 block text-gray-300 lg:mt-0 lg:inline-block">
              Prijavljen kot {session?.user.name}
            </p>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} asChild>
              <Button className="bg-slate-700 text-gray-300 hover:bg-slate-500">
                Uploadaj sliko
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Uploadaj sliko</DialogTitle>
                <DialogDescription>Spodaj prilepi URL slike</DialogDescription>
              </DialogHeader>
              <form className="grid gap-4 py-4" action={action}>
                <Form />
              </form>
            </DialogContent>
          </Dialog>

          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            legacyBehavior
          >
            <a className="ml-4 mt-4 block text-gray-300 hover:text-white lg:mt-0 lg:inline-block">
              {session ? "Od" : "Pri"}java
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
function Form() {
  let { pending } = useFormStatus();
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          URL
        </Label>
        <Input name="image" className="col-span-3" />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Loading..." : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}
