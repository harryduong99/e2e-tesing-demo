import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="env-check">{process.env.NEXT_PUBLIC_ENV_TEST}</div>
      <span className="env-secrets">{process.env.SIGNING_PRIVATE_KEY}</span>
    </main>
  );
}
