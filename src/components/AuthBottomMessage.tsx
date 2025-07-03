import Link from "next/link";

export default function AuthBottomMessage({
  text,
  linkText,
  linkTo,
}: {
  text: string;
  linkText: string;
  linkTo: string;
}) {
  return (
    <p className="mt-6 text-zinc-500">
      {text}{" "}
      <Link className="font-medium" href={linkTo}>
        {linkText}
      </Link>
    </p>
  );
}
