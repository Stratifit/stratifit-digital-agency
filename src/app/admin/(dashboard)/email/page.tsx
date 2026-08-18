import { redirect } from "next/navigation";

export const metadata = {
  title: "Communication",
};

export default function AdminEmailRedirectPage() {
  redirect("/admin/communication");
}
