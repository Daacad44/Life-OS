/**
 * Categorical tones used across the Life OS surfaces.
 *
 * Every tinted icon chip, badge, and progress bar in the prototype is one of
 * these pairs (tint background + saturated foreground), so screens name a tone
 * instead of repeating colour classes.
 */
export type Tone =
  'navy' | 'amber' | 'amberBright' | 'emerald' | 'violet' | 'red' | 'slate'

/** Tinted chip: soft background + saturated foreground. */
export const toneChip: Record<Tone, string> = {
  navy: 'bg-navy-50 text-navy-700',
  amber: 'bg-amber-100 text-amber-600',
  amberBright: 'bg-amber-100 text-amber-500',
  emerald: 'bg-accent-emerald-tint text-accent-emerald',
  violet: 'bg-accent-violet-tint text-accent-violet',
  red: 'bg-accent-red-tint text-accent-red',
  slate: 'bg-slate-100 text-slate-500',
}

/** Solid fill, e.g. progress bars and chart marks. */
export const toneFill: Record<Tone, string> = {
  navy: 'bg-navy-700',
  amber: 'bg-amber-500',
  amberBright: 'bg-amber-500',
  emerald: 'bg-accent-emerald',
  violet: 'bg-accent-violet',
  red: 'bg-accent-red',
  slate: 'bg-slate-400',
}

/** Foreground only, e.g. a coloured stat value. */
export const toneText: Record<Tone, string> = {
  navy: 'text-navy-700',
  amber: 'text-amber-600',
  amberBright: 'text-amber-500',
  emerald: 'text-accent-emerald',
  violet: 'text-accent-violet',
  red: 'text-accent-red',
  slate: 'text-slate-500',
}
