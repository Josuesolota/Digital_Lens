import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoria",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nome",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Cor do destaque",
      type: "string",
      options: {
        list: [
          { title: "Violeta", value: "violet" },
          { title: "Ciano", value: "cyan" },
          { title: "Magenta", value: "magenta" },
          { title: "Azul", value: "blue" },
        ],
        layout: "radio",
      },
      initialValue: "violet",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
