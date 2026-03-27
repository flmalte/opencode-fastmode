import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

import { SUPPORTED_MODEL } from "../lib/constants.js"
import { getFastmodeEnabled, readState, setFastmodeEnabled, toggleFastmodeEnabled } from "../lib/state.js"

async function withTempStateFile(run) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-fastmode-"))
  const filePath = path.join(directory, "fastmode.json")

  try {
    await run(filePath)
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
}

test("state defaults to disabled", async () => {
  await withTempStateFile(async (filePath) => {
    const state = await readState({ filePath })
    assert.equal(getFastmodeEnabled(state), false)
    assert.deepEqual(state, {
      models: {
        [SUPPORTED_MODEL]: {
          enabled: false,
        },
      },
    })
  })
})

test("toggle persists the updated state", async () => {
  await withTempStateFile(async (filePath) => {
    assert.equal(await toggleFastmodeEnabled({ filePath }), true)
    assert.equal(getFastmodeEnabled(await readState({ filePath })), true)

    assert.equal(await toggleFastmodeEnabled({ filePath }), false)
    assert.equal(getFastmodeEnabled(await readState({ filePath })), false)
  })
})

test("setFastmodeEnabled writes explicit state", async () => {
  await withTempStateFile(async (filePath) => {
    assert.equal(await setFastmodeEnabled(true, { filePath }), true)
    assert.equal(getFastmodeEnabled(await readState({ filePath })), true)

    assert.equal(await setFastmodeEnabled(false, { filePath }), false)
    assert.equal(getFastmodeEnabled(await readState({ filePath })), false)
  })
})
