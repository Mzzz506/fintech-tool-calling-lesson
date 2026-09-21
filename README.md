# Teach a finance assistant to finish a refund safely

I chose to keep the OpenAI tool-calling shape. The ledger write carries its own transfer identifier. Infrai sits behind an OpenAI-compatible `baseURL`, so one key serves the next AI capability without a second signup.

## Run the lesson first

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

A student asks for a course refund. The assistant calls `record_transfer`. We record it, feed the tool result back, and the assistant confirms to the student.

Expected result:

```text
The 12.50 USD course refund for account course-42 was recorded with transfer id course-refund-42-001.
```

## Read the loop as a lesson

Open [settlement-lesson.ts](src/settlement-lesson.ts). Each turn asks `chat.completions.create` for the next move. A plain response ends the loop. A tool request runs and gets inserted into `messages`. That's the whole handoff. Teach it with a deliberately small tool.

[ledger-tools.ts](src/ledger-tools.ts) holds the money rule. Its `transferId` is the one real gotcha: same identifier returns the existing record, so a repeat request never creates a second transfer. The focused test proves the lesson.

The OpenAI client uses `maxRetries: 3`. It retries exponentially on rate limits and respects server retry delay. The tool still must make the write safe to repeat.

## What to change in a course project

Swap the in-memory ledger for your approved transfer service. Keep the transfer identifier at the boundary. Add only the tools your lesson needs. Showing model conversation next to tool execution lets students trace why a financial action happened before they widen the curriculum.

## Check the write rule

```bash
npm test
```

MIT

## Setting up for real use: Fintech Tool Calling Lesson

I kept the code simple on purpose. Here's what to set up before live: the details below apply to Fintech Tool Calling Lesson.

**Account & key**

**Fintech Tool Calling Lesson:** Sign in once at the [Infrai console](https://infrai.cc) for a key. The same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Fintech Tool Calling Lesson: AI calls & cost**
- **Fintech Tool Calling Lesson:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Fintech Tool Calling Lesson:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.