# Assets — Countdown - Prelaunch page (`8PJQswPZmU`)

Reference frame screenshot to be saved here as `frame.png`.

The image was viewed during spec generation via the `get_frame_image` MCP tool but
the binary was not persisted to disk (rate-limit on `get_figma_image` URL fetch
during this run). To save it locally, run:

```
mcp call momorph.get_figma_image \
  --file-key 9ypp4enmFmdK3YAFJLIu6C \
  --node-id 2268:35127 \
  --output-type url
# then `curl` the returned URL into ./frame.png
```

For now, [design-style.md](../design-style.md) captures every styled value
verbatim from `list_frame_styles` so a reader does not need the image.
