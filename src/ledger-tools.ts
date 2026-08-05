const transfers = new Map();

export function recordTransfer({ transferId, accountId, cents, memo }) {
  if (transfers.has(transferId)) {
    return { status: "already_recorded", transfer: transfers.get(transferId) };
  }

  const transfer = {
    transferId,
    accountId,
    cents,
    memo,
    recordedAt: new Date().toISOString(),
  };
  transfers.set(transferId, transfer);
  return { status: "recorded", transfer };
}

export function transferCount() {
  return transfers.size;
}
