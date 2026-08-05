import test from "node:test";
import assert from "node:assert/strict";
import { recordTransfer, transferCount } from "./ledger-tools.ts";

test("a repeated transfer id creates one ledger record", () => {
  const id = `lesson-${Date.now()}`;
  recordTransfer({ transferId: id, accountId: "course-42", cents: 1250, memo: "practice refund" });
  const repeated = recordTransfer({ transferId: id, accountId: "course-42", cents: 1250, memo: "practice refund" });

  assert.equal(repeated.status, "already_recorded");
  assert.equal(transferCount(), 1);
});
