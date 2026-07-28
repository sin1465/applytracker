import { signOut } from "@/auth";

export default function SignOutButton() {
    return (
        <form
            action={async () => {
                "use server";

                await signOut({
                    redirectTo: "/",
                });
            }}
        >
            <button
                type="submit"
                className="rounded border px-4 py-2"
            >
                Sign out
            </button>
        </form>
    );
} 