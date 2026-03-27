import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { FastmodePlugin } from "../lib/plugin.js"

async function withTempStateFile(run) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-fastmode-plugin-"))
  const filePath = path.join(directory, "fastmode.json")
  const previous = process.env.OPENCODE_FASTMODE_STATE_FILE

  process.env.OPENCODE_FASTMODE_STATE_FILE = filePath

  try {
    await run(filePath)
  } finally {
    if (previous === undefined) delete process.env.OPENCODE_FASTMODE_STATE_FILE
    else process.env.OPENCODE_FASTMODE_STATE_FILE = previous
    await fs.rm(directory, { recursive: true, force: true })
  }
}

test("plugin sets priority tier for enabled supported model", async () => {
  await withTempStateFile(async (filePath) => {
    await fs.writeFile(
      filePath,
      JSON.stringify({ models: { "openai/gpt-5.4": { enabled: true } } }, null, 2) + "\n",
      "utf8",
    )

    const hooks = await FastmodePlugin()
    const output = { options: {} }

    await hooks["chat.params"](
      {
        sessionID: "ses_test",
        agent: "build",
        model: { providerID: "openai", id: "gpt-5.4" },
        provider: { source: "config", info: {}, options: {} },
        message: {},
      },
      output,
    )

    assert.equal(output.options.serviceTier, "priority")
  })
})

test("plugin does nothing for unsupported model", async () => {
  await withTempStateFile(async (filePath) => {
    await fs.writeFile(
      filePath,
      JSON.stringify({ models: { "openai/gpt-5.4": { enabled: true } } }, null, 2) + "\n",
      "utf8",
    )

    const hooks = await FastmodePlugin()
    const output = { options: {} }

    await hooks["chat.params"](
      {
        sessionID: "ses_test",
        agent: "build",
        model: { providerID: "openai", id: "gpt-5.4-mini" },
        provider: { source: "config", info: {}, options: {} },
        message: {},
      },
      output,
    )

    assert.equal(output.options.serviceTier, undefined)
  })
})
