migrate((app) => {
  const transcriptsCollection = new Collection({
    id: "pbc_ai_transcripts",
    name: "ai_transcripts",
    type: "base",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new Field({
        name: "asset_id",
        type: "relation",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new Field({
        name: "raw_text",
        type: "text"
      }),
      new Field({
        name: "srt_payload",
        type: "text"
      })
    ]
  });
  app.save(transcriptsCollection);

  const cutSuggestionsCollection = new Collection({
    id: "pbc_ai_cut_suggs",
    name: "ai_cut_suggestions",
    type: "base",
    fields: [
      new Field({
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        system: true,
        autogeneratePattern: "[a-z0-9]{15}"
      }),
      new Field({
        name: "asset_id",
        type: "relation",
        collectionId: "pbc_1321337024",
        maxSelect: 1
      }),
      new Field({
        name: "start_timecode",
        type: "number"
      }),
      new Field({
        name: "end_timecode",
        type: "number"
      }),
      new Field({
        name: "cut_reason",
        type: "text"
      })
    ]
  });
  app.save(cutSuggestionsCollection);
}, (app) => {
  try {
    const transcriptsCollection = app.findCollectionByNameOrId("ai_transcripts");
    app.delete(transcriptsCollection);
  } catch (err) {}

  try {
    const cutSuggestionsCollection = app.findCollectionByNameOrId("ai_cut_suggestions");
    app.delete(cutSuggestionsCollection);
  } catch (err) {}
})