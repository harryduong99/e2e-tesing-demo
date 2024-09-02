import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="env-check">{process.env.NEXT_PUBLIC_ENV_TEST}</div>
      <div className="env-secrets">{process.env.SIGNING_PRIVATE_KEY}</div>
      <div></div>
    </main>
  );
}
