import { Xumm } from "xumm";
const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_XUMM_API_SECRET;
const xamanInstance = new Xumm(apiKey, apiSecret);
export default xamanInstance;
