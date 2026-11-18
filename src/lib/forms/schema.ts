import { z } from "zod";
import { forms, type FieldDef, type FormId } from "./definitions";

/** Construit la règle de validation d'un formulaire (utilisée côté serveur). Messages = clés de traduction. */
export function schemaFor(id: FormId) {
  const def = forms[id];
  const shape: Record<string, z.ZodType> = {};
  for (const f of def.fields as readonly FieldDef[]) shape[f.name] = fieldSchema(f);
  shape.majeur = z.literal("on", { error: "majeur" });
  return z.object(shape).superRefine((data, ctx) => {
    if (def.contact === "emailOuTelephone" && !data.email && !data.telephone) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "emailOrPhone" });
    }
  });
}

function fieldSchema(f: FieldDef): z.ZodType {
  const empty = z.literal("").transform(() => undefined);
  let s: z.ZodType;
  switch (f.type) {
    case "email":
      s = z.string().trim().max(200).email({ error: "email" });
      break;
    case "tel":
      s = z.string().trim().regex(/^[+()0-9 .-]{6,25}$/, { error: "tel" });
      break;
    case "number":
      s = z.coerce.number({ error: "number" }).int({ error: "number" }).min(f.min ?? 0, { error: "number" }).max(f.max ?? 1e9, { error: "number" });
      break;
    case "date":
      s = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "date" });
      break;
    case "select":
      s = z.enum(f.options as [string, ...string[]], { error: "required" });
      break;
    case "textarea":
      s = z.string().trim().max(4000, { error: "tooLong" });
      break;
    default:
      s = z.string().trim().max(200, { error: "tooLong" });
  }
  if (f.required) {
    return f.type === "select" ? s : z.string().trim().min(1, { error: "required" }).pipe(s as never);
  }
  return z.union([empty, s]).optional();
}
