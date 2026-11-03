import Link from "next/link";
import PersonalFrame from "./PersonalFrame";
import type { Project } from "./projectData";

export default function CurrentExperience({ projects }: { projects: Project[] }) {
  return <PersonalFrame title="Selected work" description="从问题出发，记录方案、实现过程和下一步要验证的判断。">
    <section className="project-index" aria-label="项目案例">
      {projects.map((project) => <article key={project.slug} data-enter>
        <div><h2><Link href={`/work/${project.slug}`}>{project.name}</Link></h2><p>{project.cn}</p><span>{project.period}</span></div>
        <div><p>{project.summary}</p><dl><div><dt>我的角色</dt><dd>{project.role}</dd></div><div><dt>技术与方法</dt><dd>{project.stack}</dd></div></dl><Link href={`/work/${project.slug}`} className="text-action">查看案例</Link></div>
      </article>)}
    </section>
  </PersonalFrame>;
}
