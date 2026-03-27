import { SUPPORTED_MODEL } from "./constants.js"
import { getFastmodeEnabled, readState } from "./state.js"

export async function FastmodePlugin() {
  return {
    async "chat.params"(input, output) {
      const model = `${input.model.providerID}/${input.model.id}`
      if (model !== SUPPORTED_MODEL) return

      const state = await readState()
      if (!getFastmodeEnabled(state)) return

      output.options.serviceTier = "priority"
    },
  }
}

export default FastmodePlugin
