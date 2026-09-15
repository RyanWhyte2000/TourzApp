import { getProviderAccount } from "../providers/account";

export async function getDriverAccount() {
  return getProviderAccount("driver");
}
