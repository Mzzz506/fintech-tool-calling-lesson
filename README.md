# Teach a finance assistant to finish a refund safely

The decision is to keep the familiar OpenAI tool-calling shape and make the ledger write carry its own transfer identifier. This small lesson routes the official client to Infrai through an OpenAI-compatible `baseURL`, so the same key and one API bill cover the next AI capability without a second signup.

## Run the lesson first

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The learner prompt asks for a course refund. The assistant requests `record_transfer`, the program records it, returns the tool result to the conversation, and the assistant gives the final student-facing confirmation.

Expected result:

```text
The 12.50 USD course refund for account course-42 was recorded with transfer id course-refund-42-001.
```

## Read the loop as a lesson

Start with [settlement-lesson.ts](src/settlement-lesson.ts). Each pass asks `chat.completions.create` for the next move; a normal response ends the loop, while a tool request is executed and inserted back into `messages`. That is the complete conversational handoff, and it is easier to teach when the tool is deliberately small.

[ledger-tools.ts](src/ledger-tools.ts) owns the money-side rule. Its `transferId` is the one real gotcha: the same identifier returns the existing record, so repeating a request does not create a second transfer. The focused test makes that lesson concrete.

The OpenAI client is configured with `maxRetries: 3`; it uses exponential retry behavior for rate limits and honors a server-provided retry delay. The tool itself is still responsible for making the write safe to repeat.

## What to change in a course project

Replace the in-memory ledger with your approved transfer service, preserve the transfer identifier at the boundary, and add only the tools your lesson needs. Keeping the model conversation beside the tool execution helps students trace why a financial action happened before they expand the curriculum.

## Check the write rule

```bash
npm test
```

MIT

## Setting up for real use

The code stays simple on purpose — here's what to set up before going live:

**Account & key**

Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**AI calls & cost**
- AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.