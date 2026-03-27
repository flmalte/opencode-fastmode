# opencode-fastmode

Fast mode toggle for OpenCode `openai/gpt-5.4` requests.

This package avoids slash-command hacks. It uses:

- an OpenCode plugin that applies `serviceTier: "priority"` in `chat.params`
- a small CLI that updates the persisted fast mode state

Because the toggle happens outside the chat flow, it does not require a model reply and does not add transcript noise.

## What it supports

- `openai/gpt-5.4`
- all OpenCode agents that use `openai/gpt-5.4`
- persisted state in `~/.config/opencode/fastmode.json`

## Install

### 1. Install the package for the CLI

After publishing to npm:

```bash
npm install -g opencode-fastmode
```

For local development:

```bash
npm install -g /absolute/path/to/opencode-fastmode
```

### 2. Load the plugin in OpenCode

After publishing to npm, add it to `~/.config/opencode/opencode.jsonc`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-fastmode"]
}
```

For local development before publishing, you can load the repo directly from a global plugin file:

```js
export { FastmodePlugin, default } from "/absolute/path/to/opencode-fastmode/index.js"
```

Place that file in `~/.config/opencode/plugins/` and restart OpenCode.

## CLI usage

```bash
oc-fast on
oc-fast off
oc-fast toggle
oc-fast status
oc-fast path
```

Example output:

```text
Fast mode enabled for openai/gpt-5.4
```

## How it works

When fast mode is enabled, the plugin checks each model call in `chat.params`.
If the current model is `openai/gpt-5.4`, it sets:

```json
{
  "serviceTier": "priority"
}
```

No reasoning or verbosity settings are modified.

## Development

Run tests:

```bash
npm test
```

## Publish

1. Create a GitHub repo
2. Push this project
3. Publish to npm:

```bash
npm publish
```

Then switch your OpenCode config to the npm package name and remove any local plugin shim.
