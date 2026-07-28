import { AIChatPanel } from '@/features/coach/components/AIChatPanel'
import { Widget } from './Widget'

export function CoachWidget() {
  return (
    <Widget title="AI Coach" linkTo="/coach">
      <AIChatPanel compact />
    </Widget>
  )
}
