import fs from "node:fs/promises"
import path from "node:path"

import { createDefaultState, SUPPORTED_MODEL } from "./constants.js"
import { getStateFilePath } from "./paths.js"

function normalizeState(input) {
  return {
    models: {
      [SUPPORTED_MODEL]: {
        enabled: Boolean(input?.models?.[SUPPORTED_MODEL]?.enabled),
      },
    },
  }
}

export async function readState(options = {}) {
  const filePath = options.filePath || getStateFilePath(options.env)

  try {
    const text = await fs.readFile(filePath, "utf8")
    return normalizeState(JSON.parse(text))
  } catch {
    return createDefaultState()
  }
}

export async function writeState(state, options = {}) {
  const filePath = options.filePath || getStateFilePath(options.env)
  const normalized = normalizeState(state)

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8")

  return normalized
}

export function getFastmodeEnabled(state) {
  return Boolean(state?.models?.[SUPPORTED_MODEL]?.enabled)
}

export async function setFastmodeEnabled(enabled, options = {}) {
  const state = await writeState(
    {
      models: {
        [SUPPORTED_MODEL]: {
          enabled: Boolean(enabled),
        },
      },
    },
    options,
  )

  return getFastmodeEnabled(state)
}

export async function toggleFastmodeEnabled(options = {}) {
  const state = await readState(options)
  return setFastmodeEnabled(!getFastmodeEnabled(state), options)
}
