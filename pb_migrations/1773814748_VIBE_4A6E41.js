migrate((app) => {
  const collection = new Collection({
    id: "pbc_review_notes",
    name: "review_notes",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });

  collection.fields.add(new RelationField({
    name: "asset_id",
    collectionId: "pbc_1321337024",
    maxSelect: 1,
  }));

  collection.fields.add(new TextField({
    name: "author",
  }));

  collection.fields.add(new NumberField({
    name: "timestamp",
  }));

  collection.fields.add(new TextField({
    name: "note_text",
  }));

  collection.fields.add(new JSONField({
    name: "canvas_data",
  }));

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("review_notes");
  if (collection) {
    app.delete(collection);
  }
});