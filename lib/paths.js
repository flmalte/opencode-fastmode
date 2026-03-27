import os from "node:os"
import path from "node:path"

export function getConfigDirectory(env = process.env) {
  return env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config")
}

export function getStateFilePath(env = process.env) {
  if (env.OPENCODE_FASTMODE_STATE_FILE) return env.OPENCODE_FASTMODE_STATE_FILE
  return path.join(getConfigDirectory(env), "opencode", "fastmode.json")
}
