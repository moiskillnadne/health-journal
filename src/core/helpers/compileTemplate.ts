import { join } from 'path'
import { readFile } from 'fs-extra'
import { compile } from 'handlebars'

export const compileTemplate = async (templateName: string, data: any) => {
  const filePath = join(process.cwd(), 'src/templates', `${templateName}.hbs`)
  const html = await readFile(filePath, 'utf-8')

  return compile(html)(data)
}
