import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// À utiliser à la place de next/link et next/navigation : ces versions ajoutent
// automatiquement la langue et traduisent les URL.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
