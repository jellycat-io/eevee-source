export function report(
  line: number,
  column: number,
  where: string,
  message: string
) {
  console.error(
    `\x1B[1m\x1b[31mError${where} (${line}:${column}): ${message}\x1b[0m`
  )
}

export function log(message: string) {
  console.log(`\x1B[1m\x1b[34m${message}\x1b[0m`)
}

export function greet(message: string) {
  console.log(`\x1B[1m\x1b[32m${message}\x1b[0m`)
}

export function error(message: string) {
  console.error(`\x1B[1m\x1b[31m${message}\x1b[0m`)
}

export function parseError(message: string) {
  error(`Parse Error: ${message}`)
}

export function runtimeError(message: string) {
  error(`Runtime Error: ${message}`)
}
