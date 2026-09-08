import { isAuthenticated } from "@/lib/auth";
import { getManifest, speicherStatus } from "@/lib/images";
import { getTexts } from "@/lib/texts";
import { textFieldsFor } from "@/lib/slot-texts";
import { imageSlots, slotGroups } from "@/lib/slots";
import LoginForm from "./LoginForm";
import AdminPanel from "./AdminPanel";

// Der Admin-Bereich zeigt immer den aktuellen Stand – kein statisches Rendern.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) return <LoginForm />;

  const [manifest, texts, speicher] = await Promise.all([
    getManifest(),
    getTexts(),
    speicherStatus(),
  ]);

  const slots = imageSlots.map((slot) => ({
    ...slot,
    currentUrl: manifest[slot.id]?.url ?? slot.src,
    isCustom: Boolean(manifest[slot.id]),
    // Jedes Textfeld mit dem aktuell gültigen Wert – überschrieben oder aus
    // dem Code – plus der Info, ob es abweicht (für die „geändert“-Markierung).
    texts: textFieldsFor(slot).map((field) => {
      const custom = texts[slot.id]?.[field.id];
      return {
        ...field,
        value: custom?.trim() ? custom : field.fallback,
        isCustom: Boolean(custom?.trim()),
      };
    }),
  }));

  return <AdminPanel slots={slots} groups={slotGroups} speicher={speicher} />;
}
