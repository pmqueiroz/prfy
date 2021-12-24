import { GluegunCommand } from 'gluegun'
import * as sharp from 'sharp'

const command: GluegunCommand = {
  name: 'chromefy',
  run: async toolbox => {
    const { print: { success, error }, parameters: { array: args }, template, filesystem } = toolbox

    const [input, output] = args

    const fileInputPath = filesystem.isNotFile(input) ? filesystem.path(process.cwd(), input) : input

    if(!fileInputPath || filesystem.isNotFile(fileInputPath)) {
      return error('You must provide an valid input file')
    }

    if(!output) {
      return error('You must provide an output file')
    }

    const image = await sharp(fileInputPath).resize(1920, 966).toBuffer()

    const svgGenerated = await template.generate({
       template: 'chrome.svg.ejs',
       props: {
          image: `data:image/png;base64,${image.toString('base64')}`
       }
    })

    await sharp(Buffer.from(svgGenerated)).png().toFile(filesystem.path(process.cwd(), output))
    
    success(`Generated file`)
  }
}

module.exports = command
