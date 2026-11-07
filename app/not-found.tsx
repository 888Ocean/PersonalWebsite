import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell page not-found">
      <h1>没有这一页</h1>
      <p className="lede">档案里还没有这个地址。</p>
      <p>
        <Link className="text-link" href="/">
          回到首页
        </Link>
      </p>
    </main>
  );
}
