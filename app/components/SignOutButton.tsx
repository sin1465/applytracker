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
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
                Sign out
            </button>
        </form>
    );
} 