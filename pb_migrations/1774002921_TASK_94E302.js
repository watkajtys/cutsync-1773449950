migrate((app) => {
  const transcripts = new Collection({
    name: "ai_transcripts",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new TextField({
        name: "raw_text"
      }),
      new TextField({
        name: "srt_payload"
      })
    ]
  });
  app.save(transcripts);

  const cutSuggestions = new Collection({
    name: "ai_cut_suggestions",
    type: "base",
    fields: [
      new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new NumberField({
        name: "start_timecode"
      }),
      new NumberField({
        name: "end_timecode"
      }),
      new TextField({
        name: "cut_reason"
      })
    ]
  });
  app.save(cutSuggestions);
}, (app) => {
  try {
    const transcripts = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(transcripts);
  } catch (err) {}
  
  try {
    const cutSuggestions = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(cutSuggestions);
  } catch (err) {}
});