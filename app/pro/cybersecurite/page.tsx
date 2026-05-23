import { getAllCTF } from "@/lib/ctf";
import SecurityClient from "./SecurityClient";

export const dynamic = "force-dynamic";

export default function CybersecuritePage() {
  const entries = getAllCTF();
  return <SecurityClient entries={entries} />;
}
