import { GluegunCommand } from 'gluegun'
import { WarnWithCard } from '../helpers'
import * as sharp from 'sharp'

const verifyDimensions = (metadata: sharp.Metadata) => {
  return metadata.width === 1920 && metadata.height === 966
}

const command: GluegunCommand = {
  name: 'chromefy',
  run: async toolbox => {
    const {
      print,
      parameters: { array: args },
      template,
      filesystem
    } = toolbox

    const { success, error } = print
    const [input, output] = args

    const fileInputPath = filesystem.isNotFile(input)
      ? filesystem.path(process.cwd(), input)
      : input

    if (!fileInputPath || filesystem.isNotFile(fileInputPath)) {
      return error('You must provide an valid input file')
    }

    if (!output) {
      return error('You must provide an output file')
    }

    const sharpImage = sharp(fileInputPath)

    if (!verifyDimensions(await sharpImage.metadata())) {
      WarnWithCard('Prefer to use images with dimensions 1920x966', print)
    }

    const image = await sharpImage.resize(1920, 966).toBuffer()

    const svgGenerated = await template.generate({
      template: 'chrome.svg.ejs',
      props: {
        image: `data:image/png;base64,${image.toString('base64')}`
      }
    })

    await sharp(Buffer.from(svgGenerated))
      .png()
      .toFile(filesystem.path(process.cwd(), output))

    success(`Generated file`)
  }
}

module.exports = command
