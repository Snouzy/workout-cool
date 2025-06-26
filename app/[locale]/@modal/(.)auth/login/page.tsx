import { CredentialsLoginForm } from "@/features/auth/signin/ui/CredentialsLoginForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function LoginModal() {
  return (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-md">
        <CredentialsLoginForm />
      </DialogContent>
    </Dialog>
  );
}
