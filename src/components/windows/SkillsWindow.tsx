'use client'

import { Win95ScrollArea } from '@/components/ui95/Win95ScrollArea'
import type { SkillGroup } from '@/lib/default-skills'

type SkillsWindowProps = {
  groups: SkillGroup[]
}

export function SkillsWindow({ groups }: SkillsWindowProps) {
  const groupCount = groups.length
  const itemCount = groups.reduce((total, group) => total + group.items.length, 0)

  return (
    <div className="skills-window">
      <p className="skills-window__intro">System Properties — Skills</p>
      <Win95ScrollArea aria-label="Skill groups" className="skills-window__panels win95-inset">
        {groups.map((group) => (
          <section className="skills-window__group" key={group.group}>
            <h3 className="skills-window__heading">{group.group}</h3>
            <ul className="skills-window__list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </Win95ScrollArea>
      <div aria-label="Status bar" className="skills-window__status">
        <div className="skills-window__status-field">
          {groupCount} groups · {itemCount} skills — scroll for more
        </div>
        <div className="skills-window__status-field">Site Settings</div>
      </div>
    </div>
  )
}
