// A bank as returned by the backend's live bank list (sourced from Nomba's
// /v1/transfers/banks). `code` is the value sent to Nomba for name lookup and
// payouts. Fetched via fetchBanksFn / useBanksQuery — no hardcoded list, so the
// dropdown always reflects the current set.
export interface Bank {
  name: string;
  code: string;
}
