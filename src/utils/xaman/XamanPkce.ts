import { XummPkce } from 'xumm-oauth2-pkce';
const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY;
const xamanPkce = new XummPkce(apiKey, {
    implicit: true,
    redirectUrl: process.env.NEXT_PUBLIC_XUMM_API_REDIRECT_URI
});
export default xamanPkce;
