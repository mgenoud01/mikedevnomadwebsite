import { getAllCTF } from "@/lib/ctf";
import SecurityClient from "./SecurityClient";

export default function CybersecuritePage() {
  const entries = getAllCTF();
  return <SecurityClient entries={entries} />;
}
