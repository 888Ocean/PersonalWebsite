import Link from "next/link";
import PersonalFrame from "../components/PersonalFrame";

export default function AboutPage() {
  return <PersonalFrame title="A little about me" description="我是 Ocean，面向 AI 应用方向的应届生，也用摄影观察日常。">
    <section className="about-reading"><h2 data-enter>Making & seeing</h2><div data-enter><p>我通过构建 AI 应用和 Vibe Coding 实验，把想法变成可以操作、可以检验的东西。作品集里，我希望说清楚问题从哪里来、为什么这样设计，以及哪些判断还需要验证。</p><p>摄影是另一种实践：从光线、人物和场景里选择什么留下，再用顺序把照片组织成一个故事。</p><p>工作之外，我也关注健身、咖啡和骑行。这里会逐渐补上真实经历和生活记录。</p></div></section>
    <section className="about-reading" id="contact"><h2 data-enter>Currently</h2><div data-enter><p>正在寻找 AI 应用相关的工作与合作机会，持续完善项目案例、摄影故事和这个网站。</p><p>学校、专业、简历与正式联系方式尚未定稿。</p><Link className="text-action" href="/work">先看我的项目</Link></div></section>
  </PersonalFrame>;
}
