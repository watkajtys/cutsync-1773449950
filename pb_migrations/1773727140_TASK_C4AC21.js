migrate((app) => {
    // 1. Update projects collection to match roadmap (title, description)
    const projects = app.findCollectionByNameOrId("pbc_484305853");
    if (projects) {
        if (projects.fields.getByName("name")) {
            projects.fields.removeByName("name");
        }
        if (!projects.fields.getByName("title")) {
            projects.fields.add(new TextField({ name: "title" }));
        }
        if (!projects.fields.getByName("description")) {
            projects.fields.add(new TextField({ name: "description" }));
        }
        app.save(projects);
    }

    // 2. Create ai_transcripts collection
    const aiTranscripts = new Collection({
        id: "pbc_71829374651",
        name: "ai_transcripts",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: ""
    });
    aiTranscripts.fields.add(new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
    }));
    aiTranscripts.fields.add(new TextField({ name: "raw_text" }));
    aiTranscripts.fields.add(new TextField({ name: "srt_payload" }));
    app.save(aiTranscripts);

    // 3. Create ai_cut_suggestions collection
    const aiCutSuggestions = new Collection({
        id: "pbc_91827364512",
        name: "ai_cut_suggestions",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: ""
    });
    aiCutSuggestions.fields.add(new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
    }));
    aiCutSuggestions.fields.add(new NumberField({ name: "start_timecode" }));
    aiCutSuggestions.fields.add(new NumberField({ name: "end_timecode" }));
    aiCutSuggestions.fields.add(new TextField({ name: "cut_reason" }));
    app.save(aiCutSuggestions);

    // 4. Create review_notes collection (Required for Phase 4 & Phase 8: Canvas Annotations)
    const reviewNotes = new Collection({
        id: "pbc_61524372819",
        name: "review_notes",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: ""
    });
    reviewNotes.fields.add(new RelationField({
        name: "asset_id",
        collectionId: "pbc_1321337024",
        maxSelect: 1
    }));
    reviewNotes.fields.add(new TextField({ name: "author" }));
    reviewNotes.fields.add(new NumberField({ name: "timestamp" }));
    reviewNotes.fields.add(new TextField({ name: "note_text" }));
    reviewNotes.fields.add(new JSONField({ name: "canvas_data" }));
    app.save(reviewNotes);

}, (app) => {
    // Rollback projects collection changes
    try {
        const projects = app.findCollectionByNameOrId("pbc_484305853");
        if (projects) {
            if (projects.fields.getByName("title")) {
                projects.fields.removeByName("title");
            }
            if (projects.fields.getByName("description")) {
                projects.fields.removeByName("description");
            }
            if (!projects.fields.getByName("name")) {
                projects.fields.add(new TextField({ name: "name" }));
            }
            app.save(projects);
        }
    } catch (err) {
        // ignore
    }

    // Rollback new collections
    const collectionsToRemove = [
        "review_notes",
        "ai_cut_suggestions",
        "ai_transcripts"
    ];

    for (const name of collectionsToRemove) {
        try {
            const col = app.findCollectionByNameOrId(name);
            if (col) {
                app.delete(col);
            }
        } catch (err) {
            // ignore
        }
    }
});