import { defineField, defineType } from "sanity";

export const voyage = defineType({
  name: "voyage",
  title: "Voyage",
  type: "document",
  fields: [
    defineField({
      name: "titre",
      title: "Titre du voyage",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (généré automatiquement)",
      type: "slug",
      options: { source: "titre" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pays",
      title: "Pays",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "emoji",
      title: "Emoji du drapeau (ex: 🇯🇵)",
      type: "string",
    }),
    defineField({
      name: "dateDebut",
      title: "Date de début",
      type: "date",
    }),
    defineField({
      name: "dateFin",
      title: "Date de fin",
      type: "date",
    }),
    defineField({
      name: "resume",
      title: "Résumé court",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "photoCouverture",
      title: "Photo de couverture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "restos",
      title: "Restaurants & Nourriture",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "nom", title: "Nom", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 2 },
            { name: "note", title: "Note (1-5 ⭐)", type: "number", validation: (r) => r.min(1).max(5) },
            { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
            { name: "adresse", title: "Adresse / Quartier", type: "string" },
          ],
          preview: {
            select: { title: "nom", subtitle: "description", media: "photo" },
          },
        },
      ],
    }),
    defineField({
      name: "endroits",
      title: "Endroits à visiter",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "nom", title: "Nom du lieu", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 2 },
            { name: "conseil", title: "Conseil / Tip", type: "string" },
            { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
            {
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: ["Musée", "Nature", "Plage", "Ville", "Temple", "Marché", "Autre"],
              },
            },
          ],
          preview: {
            select: { title: "nom", subtitle: "type", media: "photo" },
          },
        },
      ],
    }),
    defineField({
      name: "galerie",
      title: "Galerie photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "legende", title: "Légende", type: "string" },
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "conseils",
      title: "Conseils pratiques",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "hashtags",
      title: "Hashtags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "budgetJour",
      title: "Budget par jour (€)",
      type: "number",
    }),
    defineField({
      name: "contenu",
      title: "Article complet",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "miseEnAvant",
      title: "Mettre en avant sur la page d'accueil",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "titre", subtitle: "pays", media: "photoCouverture" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
