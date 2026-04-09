import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "MikeDevNomad CMS",
    },
  },
  collections: {
    // ── Blog articles ─────────────────────────────────────
    blog: collection({
      label: "Articles de Blog",
      slugField: "titre",
      path: "content/blog/*",
      format: { contentField: "contenu" },
      schema: {
        titre: fields.slug({
          name: { label: "Titre de l'article" },
        }),
        date: fields.date({
          label: "Date de publication",
          validation: { isRequired: true },
        }),
        categorie: fields.select({
          label: "Catégorie",
          options: [
            { label: "Nomadisme", value: "nomadisme" },
            { label: "Voyage", value: "voyage" },
            { label: "Développement", value: "developpement" },
            { label: "Sécurité", value: "securite" },
            { label: "Lifestyle", value: "lifestyle" },
          ],
          defaultValue: "voyage",
        }),
        resume: fields.text({
          label: "Résumé",
          multiline: true,
          validation: { length: { max: 280 } },
        }),
        image: fields.image({
          label: "Image de couverture",
          directory: "public/images/blog",
          publicPath: "/images/blog/",
        }),
        publie: fields.checkbox({
          label: "Publié",
          defaultValue: false,
        }),
        contenu: fields.markdoc({
          label: "Contenu",
        }),
      },
    }),

    // ── Photos ───────────────────────────────────────────
    photos: collection({
      label: "Photos",
      slugField: "titre",
      path: "content/photos/*",
      schema: {
        titre: fields.slug({
          name: { label: "Titre de la photo" },
        }),
        lieu: fields.text({
          label: "Lieu (ex: Kyoto, Japon)",
          validation: { isRequired: true },
        }),
        pays: fields.text({
          label: "Pays",
        }),
        date: fields.date({
          label: "Date",
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        image: fields.image({
          label: "Photo",
          directory: "public/images/galerie",
          publicPath: "/images/galerie/",
          validation: { isRequired: true },
        }),
        mise_en_avant: fields.checkbox({
          label: "Mettre en avant",
          defaultValue: false,
        }),
      },
    }),
  },
});
