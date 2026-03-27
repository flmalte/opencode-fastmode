export const SUPPORTED_MODEL = "openai/gpt-5.4"

export function createDefaultState() {
  return {
    models: {
      [SUPPORTED_MODEL]: {
        enabled: false,
      },
    },
  }
}
