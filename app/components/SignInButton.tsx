import { signIn } from "@/auth";

export default function SignInButton() {
    return (
        <form
            action={async () => {
                "use server";

                await signIn("github", {
                    redirectTo: "/",
                });
            }}
        >
            <button
                type="submit"
                className="rounded bg-black px-4 py-2 text-white"
            >
                Sign in with GitHub
            </button>
        </form>
    );
}