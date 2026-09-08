const TONES = ['blue', 'green', 'amber', 'purple', 'red']

export function initials(name) {
  return name
    .split(' ')
    .filter((w) => w[0] && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

export function avatarTone(name) {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return TONES[sum % TONES.length]
}
