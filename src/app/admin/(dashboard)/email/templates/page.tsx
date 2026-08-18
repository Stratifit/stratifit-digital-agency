import { redirect } from "next/navigation";

export const metadata = {
  title: "Communication — Templates",
};

export default function AdminEmailTemplatesRedirectPage() {
  redirect("/admin/communication/templates");
}
