migrate((app) => {
    const aiTranscripts = new Collection({
        name: "ai_transcripts",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
        fields: [
            {
                name: "id",
                type: "text",
                primaryKey: true,
                required: true,
                system: true,
                autogeneratePattern: "[a-z0-9]{15}"
            },
            {
                name: "asset_id",
                type: "relation",
                collectionId: "pbc_1321337024",
                maxSelect: 1
            },
            {
                name: "raw_text",
                type: "text"
            },
            {
                name: "srt_payload",
                type: "text"
            }
        ]
    });
    app.save(aiTranscripts);

    const aiCutSuggestions = new Collection({
        name: "ai_cut_suggestions",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
        fields: [
            {
                name: "id",
                type: "text",
                primaryKey: true,
                required: true,
                system: true,
                autogeneratePattern: "[a-z0-9]{15}"
            },
            {
                name: "asset_id",
                type: "relation",
                collectionId: "pbc_1321337024",
                maxSelect: 1
            },
            {
                name: "start_timecode",
                type: "number"
            },
            {
                name: "end_timecode",
                type: "number"
            },
            {
                name: "cut_reason",
                type: "text"
            }
        ]
    });
    app.save(aiCutSuggestions);

    const reviewNotes = new Collection({
        name: "review_notes",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
        fields: [
            {
                name: "id",
                type: "text",
                primaryKey: true,
                required: true,
                system: true,
                autogeneratePattern: "[a-z0-9]{15}"
            },
            {
                name: "asset_id",
                type: "relation",
                collectionId: "pbc_1321337024",
                maxSelect: 1
            },
            {
                name: "author",
                type: "text"
            },
            {
                name: "timestamp",
                type: "number"
            },
            {
                name: "note_text",
                type: "text"
            },
            {
                name: "canvas_data",
                type: "json"
            }
        ]
    });
    app.save(reviewNotes);

}, (app) => {
    const collectionsToDelete = [
        "review_notes",
        "ai_cut_suggestions",
        "ai_transcripts"
    ];

    for (const name of collectionsToDelete) {
        try {
            const collection = app.findCollectionByNameOrId(name);
            if (collection) {
                app.delete(collection);
            }
        } catch (err) {
            // Ignore if collection doesn't exist
        }
    }
});