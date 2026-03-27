# opencode-fastmode

Fast mode toggle for OpenCode `openai/gpt-5.4` requests.

This package avoids slash-command hacks. It uses:

- an OpenCode plugin that applies `serviceTier: "priority"` in `chat.params`
- a small CLI that updates the persisted fast mode state

Because the toggle happens outside the chat flow, it does not require a model reply and does not add transcript noise.

## Quick start

### Local development

1. Install the CLI from this repo:

```bash
npm install -g /absolute/path/to/opencode-fastmode
```

2. Load the plugin from a global OpenCode plugin shim:

```js
export { FastmodePlugin, default } from "/absolute/path/to/opencode-fastmode/index.js"
```

Save that as `~/.config/opencode/plugins/fastmode.js`.

3. Restart OpenCode.

4. Toggle and verify:

```bash
oc-fast on
oc-fast status
```

### After publishing to npm

1. Install:

```bash
npm install -g opencode-fastmode
```

2. Add the plugin to `~/.config/opencode/opencode.jsonc`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-fastmode"]
}
```

3. Restart OpenCode.

## What it supports

- `openai/gpt-5.4`
- all OpenCode agents that use `openai/gpt-5.4`
- persisted state in `~/.config/opencode/fastmode.json`

## State file

`~/.config/opencode/fastmode.json` is the shared state between the CLI and the OpenCode plugin.

- `oc-fast on|off|toggle` writes to this file
- the plugin reads this file for every `chat.params` call
- if the file is missing, fast mode defaults to `OFF`

Example:

```json
{
  "models": {
    "openai/gpt-5.4": {
      "enabled": true
    }
  }
}
```

Yes, it is still needed in the current design. It is what makes the toggle persistent without requiring a model message, a slash command, or an OpenCode restart for every change.

If you delete it, the package will simply recreate default state on the next CLI write.

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

Use this for current state feedback:

```bash
oc-fast status
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

## Verify it is active

- run `oc-fast status`
- make sure your active model is `openai/gpt-5.4`
- restart OpenCode after changing plugin installation/config

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
