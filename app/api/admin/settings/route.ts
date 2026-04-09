import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

const ENV_FILE = path.join(process.cwd(), ".env.local");

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères" }, { status: 400 });
  }

  // Update .env.local
  let content = fs.readFileSync(ENV_FILE, "utf-8");
  content = content.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${newPassword}`);
  fs.writeFileSync(ENV_FILE, content);

  // Update process.env for current session
  process.env.ADMIN_PASSWORD = newPassword;

  return NextResponse.json({ ok: true });
}
