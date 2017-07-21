import fakeIDL from './fake_idl'
import { fakeSchema } from './fake_schema'
import {
  Source,
  parse,
  concatAST,
  buildASTSchema,
  execute,
  printSchema,
} from 'graphql'
import cuid from 'cuid'
import { typeFakers } from './fake'

const fakerIDL = parse(fakeIDL)

export function getFakeSchema(schema) {
  const idl = printSchema(schema)
  const patchedIdl = idl.split('\n').map(line => {
    if (line.includes('id: ID!')) {
      // line = line + ` @examples(values: ["${cuid()}", "${cuid()}"])`
      line = line + ` @fake(type: uuid)`
    }
    if (line.includes(': DateTime')) {
      line = line + ` @examples(values: ["2017-05-20T16:22:26.248Z", "2017-05-21T16:22:26.248Z"])`
    }
    if (line.includes('updatedFields')) {
      line = line + ` @examples(values: [["updatedAt"]])`
    }

    return line
  }).join('\n')
  const graphcoolAst = parse(patchedIdl)
  const ast = concatAST([graphcoolAst, fakerIDL])

  const newSchema = buildASTSchema(ast)
  fakeSchema(newSchema)

  return newSchema
}

// needs a faked schema
// fakeSchema(schema)
export function getSSSExampleEvent(schema, query: string) {
  try {
    const queryAst = parse(query)

    return execute(schema, queryAst)
  } catch (e) {
    // not empty
  }

  return Promise.reject(new Error(`Couldn't generate SSS example event`))
}

export function getCustomMutationExampleEvent(sdl: string) {
  try {
    const ast = parse(sdl)

    const data = ast.definitions
      .find(def => def.kind === 'TypeExtensionDefinition').definition.fields[0].arguments
      .map(getType)
      .map(({type, name}) => {
        const typeFaker = typeFakers[type]
        let value = ''
        if (typeFaker) {
          value = typeFaker.generator(typeFaker.defaultOptions)()
        } else {
          value = `<${type.name}>`
        }
        return {
          [name]: value,
        }
      })
      .reduce((acc, curr) => ({...acc, ...curr}), {})

    return {
      data,
    }
  } catch (e) {
    return {
      data: {},
    }
  }
}

function getType(inputType) {
    let type = ''
    if (inputType.type.kind === 'NonNullType') {
        type = inputType.type.type.name.value
    } else {
        type = inputType.type.name.value
    }

    return {
        type: type,
        name: inputType.name.value,
    }
}
