#!/usr/bin/env node

import { SUPPORTED_MODEL } from "../lib/constants.js"
import { getStateFilePath } from "../lib/paths.js"
import {
  getFastmodeEnabled,
  readState,
  setFastmodeEnabled,
  toggleFastmodeEnabled,
} from "../lib/state.js"

function printUsage() {
  console.log(`Usage: oc-fast <command>

Commands:
  on       Enable fast mode for ${SUPPORTED_MODEL}
  off      Disable fast mode for ${SUPPORTED_MODEL}
  toggle   Toggle fast mode for ${SUPPORTED_MODEL}
  status   Show current fast mode state
  path     Show the state file path
  help     Show this help
`)
}

async function main() {
  const command = (process.argv[2] || "status").toLowerCase()

  switch (command) {
    case "on": {
      await setFastmodeEnabled(true)
      console.log(`Fast mode enabled for ${SUPPORTED_MODEL}`)
      return
    }

    case "off": {
      await setFastmodeEnabled(false)
      console.log(`Fast mode disabled for ${SUPPORTED_MODEL}`)
      return
    }

    case "toggle": {
      const enabled = await toggleFastmodeEnabled()
      console.log(`Fast mode ${enabled ? "enabled" : "disabled"} for ${SUPPORTED_MODEL}`)
      return
    }

    case "status": {
      const state = await readState()
      console.log(`Fast mode is ${getFastmodeEnabled(state) ? "ON" : "OFF"} for ${SUPPORTED_MODEL}`)
      return
    }

    case "path": {
      console.log(getStateFilePath())
      return
    }

    case "help":
    case "--help":
    case "-h": {
      printUsage()
      return
    }

    default:
      console.error(`Unknown command: ${command}`)
      printUsage()
      process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
