import { getAllCTF } from "@/lib/ctf";
import SecurityClient from "./SecurityClient";

export const dynamic = "force-dynamic";

export default async function CybersecuritePage() {
  const entries = await getAllCTF();
  return <SecurityClient entries={entries} />;
}
