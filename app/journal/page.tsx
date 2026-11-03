import PersonalFrame from "../components/PersonalFrame";

const notes = [
  { title: "做个人网站这件事", summary: "从把页面做出来，到判断它有没有自己的表达。", body: "旧版围绕海洋主题组织页面。新一轮改版把重点移回到项目、照片与真实经历，让视觉选择服务于内容。这篇记录仍在整理中。", kind: "网站改版记录" },
  { title: "AI 的判断需要被看见", summary: "当流程变长，使用工具的人如何理解、修改和确认结果。", body: "项目案例关注模型做了什么、用户在哪里确认，以及结果如何修改。后续将补上具体交互、测试过程与复盘。", kind: "待整理的项目思考" },
  { title: "照片如何成为故事", summary: "一次选择、一种顺序，也是一种观看方法。", body: "摄影页面按故事而非单张图片组织。每个故事有自己的主题、顺序与文字；真实摄影档案仍待接入。", kind: "摄影编辑笔记" },
];

export default function JournalPage() {
  return <PersonalFrame title="Notes in progress" description="项目复盘、学习过程与日常观察。目前展示的是待完善的短记草稿。">
    <section className="journal-reading" aria-label="笔记草稿">
      {notes.map((note) => <article key={note.title} data-enter><h2>{note.title}</h2><p>{note.summary}</p><details><summary>展开短记</summary><p>{note.body}</p><p>{note.kind}</p></details></article>)}
    </section>
  </PersonalFrame>;
}
