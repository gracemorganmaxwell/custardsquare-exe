export type SkillGroup = {
  group: string
  items: string[]
}

export const DEFAULT_SKILL_GROUPS: SkillGroup[] = [
  {
    group: 'Software Development',
    items: ['TypeScript', 'JavaScript', 'Node.js', 'React', 'Python', 'C#', 'SQL'],
  },
  {
    group: 'Integrations & Automation',
    items: [
      'APIs',
      'Workflow automation',
      'Event-driven workflows',
      'Data movement',
      'System mapping',
    ],
  },
  {
    group: 'Cloud & Platforms',
    items: [
      'Google Cloud Platform',
      'PostgreSQL',
      'Power Platform',
      'Power Apps',
      'Dataverse',
      'Microsoft Fabric',
    ],
  },
  {
    group: 'Testing & Delivery',
    items: ['UAT', 'Manual testing', 'Regression testing', 'Test cases', 'Release support'],
  },
  {
    group: 'Tools & Ways of Working',
    items: ['Jira', 'Confluence', 'GitHub', 'Git', 'Docker', 'Jest', 'Agile', 'Documentation'],
  },
]

export const DEFAULT_CREDITS = `Desktop icons by aconfuseddragon (itch.io).
Windows 95/98 is a trademark of Microsoft Corporation. custardsquare.exe is an independent fan project and is not affiliated with Microsoft.`

export function parseSkillItems(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}
