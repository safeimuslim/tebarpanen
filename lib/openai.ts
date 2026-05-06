const OPENAI_API_URL = "https://api.openai.com/v1/responses"

export function getOpenAiConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  }
}

export async function createOpenAiResponse(body: object) {
  const { apiKey } = getOpenAiConfig()

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY belum diatur.")
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI request gagal (${response.status}): ${errorText}`)
  }

  return response.json()
}

export function readOpenAiOutputText(response: unknown) {
  if (
    typeof response === "object" &&
    response !== null &&
    "output_text" in response &&
    typeof response.output_text === "string"
  ) {
    return response.output_text
  }

  if (
    typeof response === "object" &&
    response !== null &&
    "output" in response &&
    Array.isArray(response.output)
  ) {
    for (const item of response.output) {
      if (
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        item.type === "message" &&
        "content" in item &&
        Array.isArray(item.content)
      ) {
        for (const content of item.content) {
          if (
            typeof content === "object" &&
            content !== null &&
            "type" in content &&
            content.type === "output_text" &&
            "text" in content &&
            typeof content.text === "string"
          ) {
            return content.text
          }
        }
      }
    }
  }

  return null
}
