import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type LexicalTextFormat = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

type TextNode = {
  detail: 0
  format: LexicalTextFormat
  mode: 'normal'
  style: ''
  text: string
  type: 'text'
  version: 1
}

type ParagraphNode = {
  children: Array<TextNode | LinkNode>
  direction: 'ltr'
  format: ''
  indent: 0
  type: 'paragraph'
  version: 1
}

type HeadingNode = {
  children: Array<TextNode | LinkNode>
  direction: 'ltr'
  format: ''
  indent: 0
  tag: 'h1' | 'h2' | 'h3'
  type: 'heading'
  version: 1
}

type ListItemNode = {
  children: Array<TextNode | LinkNode>
  direction: 'ltr'
  format: ''
  indent: 0
  type: 'listitem'
  value: number
  version: 1
}

type ListNode = {
  children: ListItemNode[]
  direction: 'ltr'
  format: ''
  indent: 0
  listType: 'bullet'
  start: 1
  tag: 'ul'
  type: 'list'
  version: 1
}

type LinkNode = {
  children: TextNode[]
  direction: 'ltr'
  fields: {
    linkType: 'custom'
    newTab: boolean
    url: string
  }
  format: ''
  indent: 0
  type: 'link'
  version: 3
}

type RootChild = ParagraphNode | HeadingNode | ListNode

const BOLD: LexicalTextFormat = 1

function text(value: string, format: LexicalTextFormat = 0): TextNode {
  return {
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text: value,
    type: 'text',
    version: 1,
  }
}

function paragraph(...children: Array<TextNode | LinkNode>): ParagraphNode {
  return {
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function heading(tag: 'h1' | 'h2' | 'h3', value: string): HeadingNode {
  return {
    children: [text(value)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    type: 'heading',
    version: 1,
  }
}

function link(url: string, label: string): LinkNode {
  return {
    children: [text(label)],
    direction: 'ltr',
    fields: {
      linkType: 'custom',
      newTab: true,
      url,
    },
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
  }
}

function bulletList(items: string[]): ListNode {
  return {
    children: items.map((item, index) => ({
      children: [text(item)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'listitem' as const,
      value: index + 1,
      version: 1 as const,
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    type: 'list',
    version: 1,
  }
}

function roleLine(title: string, dates: string): ParagraphNode {
  return paragraph(text(title, BOLD), text(` · ${dates}`))
}

function companyLine(company: string, detail: string): ParagraphNode {
  return paragraph(text(company, BOLD), text(` — ${detail}`))
}

/** Structured Lexical default seeded from gracie-resume-jul26.pdf */
export function buildDefaultResumeLexical(): SerializedEditorState {
  const children: RootChild[] = [
    heading('h1', 'Gracie Morgan-Maxwell'),
    paragraph(
      text('Christchurch, New Zealand · '),
      link('mailto:gracemorganmaxwell@gmail.com', 'gracemorganmaxwell@gmail.com'),
      text(' · +64 27 385 1608 · '),
      link('https://www.linkedin.com/in/graciemorgan-maxwell/', 'LinkedIn'),
    ),
    heading('h2', 'Not your average software engineer'),
    paragraph(
      text(
        'User-focused software developer currently seeking a new challenge, with hands-on experience across web development, integrations, automation, cloud systems, CRM-style platforms, documentation, testing and product support.',
      ),
    ),
    paragraph(
      text(
        'I enjoy building practical solutions that connect systems, improve processes, and make work easier for the people who use them. My background across software engineering, operations, customer experience and QA means I can work between technical and business stakeholders, clarify requirements, document systems clearly, and deliver reliable improvements across different platforms.',
      ),
    ),
    heading('h2', 'Technical skills'),
    bulletList([
      'Software Development: TypeScript, JavaScript, Node.js, React, Python, C#, SQL',
      'Integrations & Automation: APIs, workflow automation, event-driven workflows, data movement, system mapping, business process automation',
      'Cloud & Platforms: Google Cloud Platform, PostgreSQL, Power Platform, Power Apps, Power Pages, Dataverse, Microsoft Fabric',
      'CRM / Platform Experience: Salesforce Certified, Dataverse, Power Platform, customer data workflows',
      'Testing & Delivery: UAT, manual testing, regression testing, test cases, bug documentation, release support',
      'Tools: Jira, Confluence, GitHub, Git, Postman, Docker, Jest, VS Code',
      'Ways of Working: Agile, stakeholder communication, technical documentation, requirements clarification, product support',
    ]),
    heading('h2', 'Professional experience'),
    companyLine('Ava Tech', 'New Zealand (remote)'),
    paragraph(
      text(
        'Technology consultancy delivering integration, automation, and digital workflow solutions for business clients.',
      ),
    ),
    roleLine('Integration Engineer (Contractor)', 'Dec 2024 – Present'),
    bulletList([
      'Worked across Power Platform, Power Pages, Dataverse, Microsoft Fabric and client integration projects.',
      'Supported application workflows involving forms, data movement, business rules and user-facing processes.',
      'Created implementation notes, As-Built documentation, test cases and quality checks for client-facing systems.',
      'Clarified requirements, edge cases and expected behaviour with technical and business stakeholders.',
      'Supported QA, UAT and product testing across workflows, forms, data movement and system behaviour.',
    ]),
    companyLine('Streamliners', 'Christchurch, CBD (in-person)'),
    paragraph(
      text(
        'Health technology company behind HealthPathways, building digital tools that support healthcare guidance.',
      ),
    ),
    roleLine('Engineering Intern', 'April 2025 – August 2025'),
    bulletList([
      'Completed a 400-hour capstone project focused on internal developer tooling.',
      'Built a dev tool using TypeScript, React, and C#/ASP.NET to help manage user permissions.',
      'Designed and implemented a Python-based solution to migrate bulk user permissions.',
      'Worked in an Agile team through sprint ceremonies, code reviews, and iterative delivery.',
    ]),
    companyLine('Ruralco', 'Ashburton, Canterbury (in-person)'),
    paragraph(
      text(
        'Cloud-based statement processing and migration work supporting business-critical rural services.',
      ),
    ),
    roleLine('Cloud Full Stack Developer', 'Oct 2025 – April 2026'),
    bulletList([
      'Built and supported cloud-based services using TypeScript, Node.js, PostgreSQL, Google Cloud Platform and Jest.',
      'Worked on a monthly statement pipeline producing IRD-approved outputs for Xero and MYOB.',
      'Supported SFTP-based data movement, scheduled processing and business-critical file outputs.',
      'Helped migrate away from a legacy system, contributing to an estimated saving of NZD $12k per month.',
    ]),
    companyLine('Realtor.co.nz', 'New Zealand (remote)'),
    paragraph(
      text(
        'Property technology startup developing and testing MVP product features for real estate users.',
      ),
    ),
    roleLine('QA / UAT Specialist', 'Aug 2025 – Dec 2025'),
    bulletList([
      'Tested MVP features across login, roles, navigation, user journeys and regression scenarios.',
      'Documented issues clearly and supported release readiness through structured UAT feedback.',
      'Used manual and exploratory testing to identify defects, inconsistencies and usability concerns.',
    ]),
    heading('h2', 'Education'),
    paragraph(text('Bachelor of Software Engineering — B+ Grade Average', BOLD)),
    paragraph(text('Whitecliffe — Technology & Innovation · 2022 – 2025')),
    bulletList([
      'Practical experience across full-stack development, cloud, databases, testing, documentation and Agile delivery.',
      'Received a scholarship for course fees in the first and second years.',
    ]),
    heading('h2', 'Community involvement'),
    companyLine('Python New Zealand Board', 'hybrid'),
    roleLine('Secretary', '2025 – Present'),
    bulletList([
      'Support community communications, events (Meetups) and governance administration.',
      'Involved in local and national Python community, including Kiwi PyCon planning.',
    ]),
    companyLine('Spark New Zealand', 'hybrid'),
    roleLine('Digital Experience & Social Media Specialist', 'January 2014 – August 2019'),
    bulletList([
      'Supported customers through digital and social media channels with clear communication and judgement.',
      'Built strong experience understanding customer journeys, pain points and support impacts.',
    ]),
    companyLine('Lean Canvas', 'Christchurch, NZ (in-person)'),
    roleLine('Community & Events Coordinator', 'March 2024 – March 2025'),
    bulletList([
      'Organised and hosted community events for startups, developers and creatives.',
      'Founded and facilitated “Roast & Toast,” a regular event supporting idea validation and practical feedback.',
    ]),
    paragraph(text('More work history, references, and transcript available upon request.')),
  ]

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as SerializedEditorState
}

export function isLexicalContentEmpty(content: SerializedEditorState | null | undefined): boolean {
  if (!content?.root?.children || content.root.children.length === 0) {
    return true
  }

  return content.root.children.every((child) => {
    if (!('children' in child) || !Array.isArray(child.children)) {
      return false
    }

    return child.children.length === 0
  })
}
