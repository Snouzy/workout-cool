import { CredentialsLoginForm } from "@/features/auth/signin/ui/CredentialsLoginForm";
import { isGoogleOAuthEnabled } from "@/features/auth/lib/is-google-oauth-enabled";

export default async function AuthSignInPage() {
  const googleOAuthEnabled = isGoogleOAuthEnabled();

  return <CredentialsLoginForm googleOAuthEnabled={googleOAuthEnabled} />;
}
