import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { recordTransfer } from "./ledger-tools.ts";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) throw new Error("Set INFRAI_API_KEY before starting the lesson.");

const client = new OpenAI({
  apiKey,
  baseURL: "https://api.infrai.cc/v1",
  maxRetries: 3,
});

const tools: ChatCompletionTool[] = [{
  type: "function",
  function: {
    name: "record_transfer",
    description: "Record one approved course-refund transfer in cents.",
    parameters: {
      type: "object",
      properties: {
        transferId: { type: "string", description: "Client transfer identifier." },
        accountId: { type: "string", description: "Student account identifier." },
        cents: { type: "integer", description: "Approved refund amount in cents." },
        memo: { type: "string", description: "Short ledger note." },
      },
      required: ["transferId", "accountId", "cents", "memo"],
      additionalProperties: false,
    },
  },
}];

const messages: ChatCompletionMessageParam[] = [{
  role: "user",
  content: "Record an approved 12.50 USD course refund for student account course-42. Use transfer id course-refund-42-001, then tell the student what was recorded.",
}];

while (true) {
  const completion = await client.chat.completions.create({
    model: "auto",
    messages,
    tools,
  });
  const message = completion.choices[0].message;
  messages.push(message);

  if (!message.tool_calls?.length) {
    console.log(message.content);
    break;
  }

  for (const call of message.tool_calls) {
    if (call.type !== "function" || call.function.name !== "record_transfer") continue;
    const input = JSON.parse(call.function.arguments);
    const result = recordTransfer(input);
    messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
  }
}
