import { GluegunPrint } from 'gluegun'

const RIGHT_BOTTOM_CORNER = '───╯'
const RIGHT_TOP_CORNER = '───╮'
const LEFT_BOTTOM_CORNER = '╰───'
const LEFT_TOP_CORNER = '╭───'
const LINE_CHAR = '─'

export const WarnWithCard = (input: string, print: GluegunPrint) => {
  if (!input || typeof input !== 'string') {
    print.error('Please provide a valid input')
    process.exit(1)
  }

  const MAX_LINE_WIDTH = 45

  const inputByWords = input.split(' ')

  const inputByParagraph = inputByWords.reduce(
    (acc, curr, index) => {
      let lastPositionAcc = acc[acc.length - 1]

      const concatenated = [lastPositionAcc, curr]

      const joinedStrings =
        index === 0 ? concatenated.join('') : concatenated.join(' ')

      if (joinedStrings.length >= MAX_LINE_WIDTH) {
        acc.push(curr)
        return acc
      } else {
        acc[acc.length - 1] = joinedStrings

        return acc
      }
    },
    ['']
  )

  print.warning(generateCard(inputByParagraph))

  function generateCard(lines) {
    let card = []

    const HIGHER_LINE_WIDTH = lines.reduce(
      (acc, curr) => (curr.length > acc ? curr.length : acc),
      0
    )

    const headLine = `${LEFT_TOP_CORNER}${fillWithChar(
      LINE_CHAR,
      HIGHER_LINE_WIDTH
    )}${RIGHT_TOP_CORNER}`
    const tailLine = `${LEFT_BOTTOM_CORNER}${fillWithChar(
      LINE_CHAR,
      HIGHER_LINE_WIDTH
    )}${RIGHT_BOTTOM_CORNER}`

    const generatedLines = lines.map(
      line => `│   ${padding(HIGHER_LINE_WIDTH, line)}   │`
    )
    const placeholderLine = `│   ${padding(HIGHER_LINE_WIDTH, '')}   │`

    return card
      .concat([' ', headLine, placeholderLine], generatedLines, [
        placeholderLine,
        tailLine,
        ' '
      ])
      .join('\n')
  }

  function fillWithChar(char, times) {
    return Array(times)
      .fill(char)
      .join('')
  }

  function padding(length, text) {
    const totalSpace = Math.floor(length - text.length)
    const beforeSpace = Math.floor(totalSpace / 2)

    return text.padStart(beforeSpace + text.length).padEnd(length)
  }
}
